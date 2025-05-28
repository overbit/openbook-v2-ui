import {
  MarketAccount,
  OPENBOOK_PROGRAM_ID,
  OpenBookV2Client,
  OpenbookV2,
  IDL,
  Market,
  nameToString,
  Order,
  BookSide,
} from "@openbook-dex/openbook-v2";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { programId } from "./utils";

// MAINNET
// export const RPC = "https://misty-wcb8ol-fast-mainnet.helius-rpc.com/";
// DEVNET
export const RPC = "https://skilled-powerful-leaf.solana-devnet.quiknode.pro/1cc7cc4d47403a18c9c63e4407849e4ac3767572/";

async function findAllMarkets(
  connection: any,
  provider: AnchorProvider,
  programId: PublicKey
) {

  const program = new Program<OpenbookV2>(
    IDL,
    programId,
    provider
  );

  const marketDiscriminatorB58 = 'dkokXHR3DTw';
  const openOrderAdminPublicKey = '9a1nsA5o2AcD86VoyupeMc6nEuuQQ9StVxq34kea9Bmz';
  const filters = [{ memcmp: { offset: 0, bytes: marketDiscriminatorB58 } }];

  if (openOrderAdminPublicKey) {
    filters.push({
      memcmp: { offset: 88, bytes: openOrderAdminPublicKey },
    });
  }

  const marketAccounts = await connection.getProgramAccounts(
    OPENBOOK_PROGRAM_ID,
    {
      filters,
    }
  );
  return marketAccounts.map(
    (x) =>
      {
        const account : MarketAccount = program.coder.accounts.decode(
          'market',
          x.account.data
        );
        return{
        market: x.pubkey.toBase58(),
        baseMint: account.baseMint.toBase58(),
        quoteMint: account.quoteMint.toBase58(),
        name: nameToString(account.name),
      }
    }
  );
}

export const fetchData = async (provider: AnchorProvider) => {
  const markets = await findAllMarkets(provider.connection, provider, programId);
  return markets;
};

export const getMarket = async (
  client: OpenBookV2Client,
  publicKey: string
): Promise<Market> => {
  try {
    let market = await Market.load(client, new PublicKey(publicKey));
    return market ? market : ({} as Market);
    
  } catch (error) {
    console.error(`Error loading market ${publicKey}:`, error);
  }
  return null;
};

// Define market data interface
interface MarketData {
  name: string;
  market: string;
  baseMint: string;
  quoteMint: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow for additional properties
}


// Store for market data cache
let marketsCache: MarketData[] = [];


/**
 * Initialize and fetch all markets
 */
export async function initializeMarkets(provider: AnchorProvider) {
  try {
    marketsCache = await fetchData(provider);
    console.log('Markets loaded:', marketsCache.length);
    return marketsCache;
  } catch (error) {
    console.error('Error initializing markets:', error);
    return [];
  }
}
/**
 * Get available markets list
 */
export async function getAvailableMarkets(provider: AnchorProvider) {
  try {
    if (marketsCache.length === 0) {
      await initializeMarkets(provider);
    }
    
    return marketsCache.map(market => ({
      symbol: market.name,
      marketId: market.market,
      baseMint: market.baseMint,
      quoteMint: market.quoteMint,
    }));
  } catch (error) {
    console.error('Error fetching available markets:', error);
    return [];
  }
}

/**
 * Get market stats for a specific market
 */
export async function getMarketStats(marketSymbol: string, openbookClient: OpenBookV2Client) {
  try {
    const marketData = await getMarketBySymbol(marketSymbol, openbookClient);
    
    if (!marketData || !marketData.market) {
      return null;
    }

    // Get current price from the orderbook
    const orderbook = await getOrderbook(marketSymbol, openbookClient);
    const currentPrice = orderbook.asks.length > 0 ? orderbook.asks[0].price : 
                        orderbook.bids.length > 0 ? orderbook.bids[0].price : 0;

    return {
      price: currentPrice.toFixed(6),
      change: '+0.00%', // Would need historical data to calculate
      high24h: (currentPrice * 1.05).toFixed(6),
      low24h: (currentPrice * 0.95).toFixed(6),
      volume24h: '0.000', // Would need to calculate from fills
      isPositive: true,
    };
  } catch (error) {
    console.error(`Error fetching market stats for ${marketSymbol}:`, error);
    return null;
  }
}

/**
 * Get market data for a specific market by symbol
 */
export async function getMarketBySymbol(marketSymbol: string, openbookClient: OpenBookV2Client) {
  try {
    // Initialize markets if not cached
    if (marketsCache.length === 0) {
      await initializeMarkets(openbookClient.provider);
    }

    // Find market by name
    const marketInfo = marketsCache.find(m => m.name === marketSymbol);
    
    if (!marketInfo) {
      console.error(`Market not found for symbol: ${marketSymbol}`);
      return null;
    }

    // Load the actual market data using utils
    const market = await getMarket(openbookClient, marketInfo.market);
    
    if (!market) {
      console.error(`Failed to load market: ${marketInfo.market}`);
      return null;
    }

    return {
      marketInfo,
      market,
      baseMint: marketInfo.baseMint,
      quoteMint: marketInfo.quoteMint,
    };
  } catch (error) {
    console.error(`Error fetching market data for ${marketSymbol}:`, error);
    return null;
  }
}

/**
 * Get orderbook for a specific market
 */
export async function getOrderbook(marketSymbol: string, openbookClient: OpenBookV2Client) {
  try {
    const marketData = await getMarketBySymbol(marketSymbol, openbookClient);
    
    if (!marketData || !marketData.market) {
      return { bids: [], asks: [] };
    }

    const market = marketData.market;
    
    // Load bids and asks using the market instance (without connection parameter)
    const [bidsAccount, asksAccount] = await Promise.all([
      market.loadBids(),
      market.loadAsks()
    ]);

    // Get orders using the utility function
    const bids = getBooksideOrders(bidsAccount);
    const asks = getBooksideOrders(asksAccount);

    return {
      bids: bids.slice(0, 10).map(order => ({
        price: order.price,
        size: order.size,
        total: order.price * order.size,
      })),
      asks: asks.slice(0, 10).map(order => ({
        price: order.price,
        size: order.size,
        total: order.price * order.size,
      }))
    };
  } catch (error) {
    console.error(`Error fetching orderbook for ${marketSymbol}:`, error);
    return { bids: [], asks: [] };
  }
}

/**
 * Get historical prices (mock data for now as this requires more complex implementation)
 */
export async function getHistoricalPrices(marketSymbol: string, openbookClient: OpenBookV2Client) {
  try {
    const marketData = await getMarketBySymbol(marketSymbol, openbookClient);
    
    if (!marketData) {
      return [];
    }

    // Get current price
    const orderbook = await getOrderbook(marketSymbol, openbookClient);
    const basePrice = orderbook.asks.length > 0 ? orderbook.asks[0].price : 
                     orderbook.bids.length > 0 ? orderbook.bids[0].price : 1;
    
    // Generate mock historical data around current price
    const mockData = [
      { time: '00:00', price: basePrice * 0.97 },
      { time: '04:00', price: basePrice * 0.99 },
      { time: '08:00', price: basePrice * 1.01 },
      { time: '12:00', price: basePrice * 1.02 },
      { time: '16:00', price: basePrice * 1.01 },
      { time: '20:00', price: basePrice },
    ];
    
    return mockData;
  } catch (error) {
    console.error(`Error fetching historical prices for ${marketSymbol}:`, error);
    return [];
  }
}


export function getBooksideOrders(bookside: BookSide): Order[] {
  const orders: Order[] = [];

  for (const order of bookside.items()) {
    orders.push(order);
  }
 
  return orders;
}

