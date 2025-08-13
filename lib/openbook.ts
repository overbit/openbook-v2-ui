import {
  MarketAccount,
  OpenBookV2Client,
  OpenbookV2,
  IDL,
  Market,
  nameToString,
  Order,
  BookSide,
  OpenOrders,
  baseLotsToUi,
  FillEvent,
  OutEvent,
  EventType,
  OpenOrdersAccount,
} from "@openbook-dex/openbook-v2";
import { PublicKey } from "@solana/web3.js";
import { AnchorProvider, BorshCoder, Program } from "@coral-xyz/anchor";
import { OPENBOOK_MARKET_ADMIN, OPENBOOK_PROGRAM_ID } from "./utils";

async function findAllMarkets(provider: AnchorProvider) {
  const marketDiscriminatorB58 = "dkokXHR3DTw";
  const openOrderAdminPublicKey = OPENBOOK_MARKET_ADMIN;
  const filters = [{ memcmp: { offset: 0, bytes: marketDiscriminatorB58 } }];

  if (openOrderAdminPublicKey) {
    filters.push({
      memcmp: { offset: 88, bytes: openOrderAdminPublicKey },
    });
  }

  const marketAccounts = await provider.connection.getProgramAccounts(
    new PublicKey(OPENBOOK_PROGRAM_ID),
    {
      filters,
    }
  );
  const program = new Program<OpenbookV2>(IDL, OPENBOOK_PROGRAM_ID, provider);
  return marketAccounts.map((x) => {
    const account: MarketAccount = program.coder.accounts.decode(
      "market",
      x.account.data
    );

    return {
      market: x.pubkey.toBase58(),
      baseMint: account.baseMint.toBase58(),
      quoteMint: account.quoteMint.toBase58(),
      name: nameToString(account.name),
    };
  });
}

export const fetchData = async (provider: AnchorProvider) => {
  const markets = await findAllMarkets(provider);
  return markets;
};

export const getMarket = async (
  client: OpenBookV2Client,
  publicKey: string
): Promise<Market | null> => {
  try {
    const market = await Market.load(client, new PublicKey(publicKey));
    return market ? market : ({} as Market);
  } catch (error) {
    console.error(`Error loading market ${publicKey}:`, error);
  }
  return null;
};

// Define market data interface
export interface MarketData {
  name: string;
  market: string;
  baseMint: string;
  quoteMint: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Allow for additional properties
}

// Store for market data cache
let marketsCache: MarketData[] = [];

// Store for open order accounts cache
const ooasCache = new Map<string, OpenOrdersAccount>();

/**
 * Initialize and fetch all markets
 */
export async function initializeMarkets(provider: AnchorProvider) {
  try {
    marketsCache = await fetchData(provider);
    console.log("Markets loaded:", marketsCache.length);
    return marketsCache;
  } catch (error) {
    console.error("Error initializing markets:", error);
    return [];
  }
}
/**
 * Get available markets list
 */
export async function getAvailableMarkets(
  provider: AnchorProvider
): Promise<MarketData[]> {
  try {
    if (marketsCache.length === 0) {
      await initializeMarkets(provider);
    }

    return marketsCache;
  } catch (error) {
    console.error("Error fetching available markets:", error);
    return [];
  }
}

export interface MarketStatsData {
  price: string;
  change: string;
  high24h: string;
  low24h: string;
  volume24h: string;
  isPositive: boolean;
  quoteSymbol: string;
}

/**
 * Get market stats for a specific market
 */
export async function getMarketStats(
  marketSymbol: string,
  openbookClient: OpenBookV2Client
): Promise<MarketStatsData | null> {
  try {
    const marketData = await getMarketBySymbol(marketSymbol, openbookClient);

    if (!marketData || !marketData.market) {
      return null;
    }

    // Get current price from the orderbook
    const orderbook = await getOrderbook(marketSymbol, openbookClient);
    const currentPrice =
      orderbook.asks.length > 0
        ? orderbook.asks[0].price
        : orderbook.bids.length > 0
        ? orderbook.bids[0].price
        : 0;

    return {
      price: currentPrice.toFixed(6),
      change: "+0.00%", // Would need historical data to calculate
      high24h: (currentPrice * 1.05).toFixed(6),
      low24h: (currentPrice * 0.95).toFixed(6),
      volume24h: "0.000", // Would need to calculate from fills
      isPositive: true,
      quoteSymbol: marketData.marketInfo.name.split("/")[1],
    };
  } catch (error) {
    console.error(`Error fetching market stats for ${marketSymbol}:`, error);
    return null;
  }
}

/**
 * Get market data for a specific market by symbol
 */
export async function getMarketBySymbol(
  marketSymbol: string,
  openbookClient: OpenBookV2Client
) {
  try {
    // Initialize markets if not cached
    if (marketsCache.length === 0) {
      await initializeMarkets(openbookClient.provider);
    }

    // Find market by name
    const marketInfo = marketsCache.find((m) => m.name === marketSymbol);

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
export async function getOrderbook(
  marketSymbol: string,
  openbookClient: OpenBookV2Client
) {
  try {
    const marketData = await getMarketBySymbol(marketSymbol, openbookClient);

    if (!marketData || !marketData.market) {
      return { bids: [], asks: [] };
    }

    const market = marketData.market;

    // Load bids and asks using the market instance (without connection parameter)
    const { bids: bidsAccount, asks: asksAccount } =
      await market.loadOrderBook();

    // Get orders using the utility function
    const bids = getBooksideOrders(bidsAccount);
    const asks = getBooksideOrders(asksAccount);

    return {
      bids: bids.slice(0, 10).map((order) => ({
        price: order.price,
        size: order.size,
        total: order.price * order.size,
      })),
      asks: asks.slice(0, 10).map((order) => ({
        price: order.price,
        size: order.size,
        total: order.price * order.size,
      })),
      baseSymbol: marketData.marketInfo.name.split("/")[0],
      quoteSymbol: marketData.marketInfo.name.split("/")[1],
    };
  } catch (error) {
    console.error(`Error fetching orderbook for ${marketSymbol}:`, error);
    return { bids: [], asks: [] };
  }
}

/**
 * Get historical prices (mock data for now as this requires more complex implementation)
 */
export async function getHistoricalPrices(
  marketSymbol: string,
  openbookClient: OpenBookV2Client
) {
  try {
    const marketData = await getMarketBySymbol(marketSymbol, openbookClient);

    if (!marketData) {
      return [];
    }

    // Get current price
    const orderbook = await getOrderbook(marketSymbol, openbookClient);
    const basePrice =
      orderbook.asks.length > 0
        ? orderbook.asks[0].price
        : orderbook.bids.length > 0
        ? orderbook.bids[0].price
        : 1;

    // Generate mock historical data around current price
    const mockData = [
      { time: "00:00", price: basePrice * 0.97 },
      { time: "04:00", price: basePrice * 0.99 },
      { time: "08:00", price: basePrice * 1.01 },
      { time: "12:00", price: basePrice * 1.02 },
      { time: "16:00", price: basePrice * 1.01 },
      { time: "20:00", price: basePrice },
    ];

    return mockData;
  } catch (error) {
    console.error(
      `Error fetching historical prices for ${marketSymbol}:`,
      error
    );
    return [];
  }
}

export function getBooksideOrders(bookside: BookSide | undefined): Order[] {
  const orders: Order[] = [];

  if (!bookside) {
    return orders;
  }

  for (const order of bookside.items()) {
    orders.push(order);
  }

  return orders;
}

export enum Side {
  Bid = "Bid",
  Ask = "Ask",
}

export interface OrderEvent {
  eventType: EventType;
  seqNum: number;
  ownerClientOrderId?: number;
  side: Side;
  amount: number;
  price?: number;
  ownerOoa: PublicKey;
  ownerAddress: PublicKey;
  timestamp: Date;
}

const getOrderEvents = async (
  market: Market,
  event: FillEvent | OutEvent
): Promise<OrderEvent[]> => {
  const eventType = event.eventType === 0 ? EventType.Fill : EventType.Out;
  const ooas = await getOoasByPublicKey(
    eventType === EventType.Fill ? [event.taker, event.maker] : [event.owner],
    market
  );

  switch (eventType) {
    case EventType.Fill:
      return [
        {
          eventType: EventType.Fill,
          seqNum: event.seqNum?.toNumber(),
          side: event.takerSide === 0 ? Side.Bid : Side.Ask,
          ownerClientOrderId: event.takerClientOrderId?.toNumber(),
          amount: event.quantity?.toNumber(),
          price: market.priceLotsToUi(event.price),
          ownerOoa: event.taker,
          ownerAddress: ooas.get(event.taker)?.owner || PublicKey.default,
          timestamp: event.timestamp
            ? new Date(event.timestamp.toNumber() * 1000)
            : new Date(),
        },
        {
          eventType: EventType.Fill,
          seqNum: event.seqNum?.toNumber(),
          side: event.takerSide === 0 ? Side.Ask : Side.Bid,
          ownerClientOrderId: event.makerClientOrderId?.toNumber(),
          amount: event.quantity?.toNumber(),
          price: market.priceLotsToUi(event.price),
          ownerOoa: event.maker,
          ownerAddress: ooas.get(event.maker)?.owner || PublicKey.default,
          timestamp: event.timestamp
            ? new Date(event.timestamp.toNumber() * 1000)
            : new Date(),
        },
      ];
    case EventType.Out:
      return [
        {
          eventType: EventType.Out,
          seqNum: event.seqNum?.toNumber(),
          side: event.side === 0 ? Side.Bid : Side.Ask,
          ownerOoa: event.owner,
          ownerAddress: ooas.get(event.owner)?.owner || PublicKey.default,
          amount: event.quantity?.toNumber(),
          timestamp: event.timestamp
            ? new Date(event.timestamp.toNumber() * 1000)
            : new Date(),
        },
      ];
    default:
      throw new Error(`Unknown event type: ${eventType}`);
  }
};

export async function getRecentOrderEvents(
  marketSymbol: string,
  openbookClient: OpenBookV2Client
): Promise<OrderEvent[] | null | undefined> {
  const marketData = await getMarketBySymbol(marketSymbol, openbookClient);

  if (!marketData || !marketData.market) {
    return null;
  }

  const market = await Market.load(openbookClient, marketData.market.pubkey);

  // Load event queue which contains fill events (matched orders)
  await market.loadEventHeap();
  const events: OrderEvent[] = [];

  for (const event of market.eventHeap?.rawEvents() || []) {
    const buffer = Buffer.from([event.eventType].concat(event.padding));
    try {
      switch (event.eventType) {
        case EventType.Fill: {
          const fillEvent =
            openbookClient.program.coder.types.decode<FillEvent>(
              "FillEvent",
              buffer
            );
          if (fillEvent) {
            const parsedEvents = await getOrderEvents(market, fillEvent);
            events.push(...parsedEvents);
          }
          break;
        }
        case EventType.Out: {
          const outEvent = openbookClient.program.coder.types.decode<OutEvent>(
            "OutEvent",
            buffer
          );
          if (outEvent) {
            const parsedEvents = await getOrderEvents(market, outEvent);
            events.push(...parsedEvents);
          }
          break;
        }
        default:
          throw "Unknown event type";
      }
    } catch (error) {
      console.error("Error decoding event:", error);
    }
  }
  console.log(`Loaded ${events.length} events for market ${marketSymbol}`);

  return events;
}

export async function getRecentTrades(
  marketSymbol: string,
  openbookClient: OpenBookV2Client
) {
  const marketData = await getMarketBySymbol(marketSymbol, openbookClient);

  if (!marketData || !marketData.market) {
    return null;
  }

  const market = await Market.load(openbookClient, marketData.market.pubkey);

  // Load event queue which contains fill events (matched orders)
  const eventHeap = await market.loadEventHeap();
  const events: (FillEvent | OutEvent)[] = [];

  for (const event of eventHeap.parsedEvents()) {
    events.push(event);
  }

  try {
    const fillEvents = events
      .filter((e) => e.eventFlags.fill)
      .slice(-50) // get last 50 fill events
      .map((e, idx) => ({
        index: idx,
        price: market.priceLotsToUi(e.price),
        size: market.baseLotsToUi(e.quantity),
        takerSide: e.takerSide,
        maker: e.maker,
        taker: e.taker,
        timestamp: e.timestamp,
      }));

    console.log(
      `Last 50 matched orders on market ${marketData.market.pubkey.toBase58()}:`
    );
    console.table(fillEvents);
    return fillEvents;
  } catch (error) {
    console.error(
      `Error loading event heap for market ${marketSymbol}:`,
      error
    );
    return [];
  }
}

export async function getOpenOrders(
  marketSymbol: string,
  openbookClient: OpenBookV2Client
) {
  try {
    const marketData = await getMarketBySymbol(marketSymbol, openbookClient);

    if (!marketData || !marketData.market) {
      return [];
    }

    const market = marketData.market;

    // Load bids and asks using the market instance (without connection parameter)
    const [bidsAccount, asksAccount] = await Promise.all([
      market.loadBids(),
      market.loadAsks(),
    ]);

    // Get orders using the utility function
    const bids = getBooksideOrders(bidsAccount);
    const asks = getBooksideOrders(asksAccount);

    const openOrders = [...bids, ...asks].map((order) =>
      booksideOrderToOrderDetails(order)
    );

    return await loadOwnerAddress(openOrders, market);
  } catch (error) {
    console.error(`Error fetching orderbook for ${marketSymbol}:`, error);
    return [];
  }
}

async function loadOwnerAddress(
  orders: OrderDetails[],
  market: Market
): Promise<OrderDetails[]> {
  const ooasPublicKeys = orders
    .filter((order) => order.ooaAddressPk)
    .map((order) => order.ooaAddressPk);

  const ooas = await getOoasByPublicKey(ooasPublicKeys, market);
  orders.forEach((order) => {
    const ooa = ooas.get(order.ooaAddressPk);
    if (!ooa) {
      console.warn(
        `OpenOrders account not found for public key: ${order.ooaAddressPk}`
      );
      return;
    }
    order.ownerAddress = ooa["owner"].toBase58();
  });

  return orders;
}

export interface OrderDetails {
  seqNum: number;
  side: string;
  marketName: string;
  price: number;
  amount: number;
  ooaAddressPk: PublicKey;
  ownerAddress?: string; // Added to store the owner address
  isExpired: boolean;
  originalOrderId: number;
  createdAt: string;
}

function booksideOrderToOrderDetails(bookSideOrder: Order): OrderDetails {
  return {
    seqNum: bookSideOrder.seqNum.toNumber(),
    side: bookSideOrder.side.bid ? "Buy" : "Sell",
    marketName: nameToString(bookSideOrder.market.account.name),
    price: bookSideOrder.price,
    amount: bookSideOrder.size, // baseLotsToUi(bookSideOrder.market.account, bookSideOrder.size),
    ooaAddressPk: bookSideOrder.leafNode.owner,
    ownerAddress: "NEED TO LOAD", // Placeholder, will be filled later
    isExpired: bookSideOrder.isExpired,
    originalOrderId: bookSideOrder.leafNode.clientOrderId.toNumber(),
    createdAt: new Date(
      bookSideOrder.leafNode.timestamp * 1000
    ).toLocaleString(),
  };
}

async function getOoasByPublicKey(
  ooasPublicKey: PublicKey[],
  market: Market
): Promise<Map<PublicKey, OpenOrdersAccount>> {
  const cacheMiss = ooasPublicKey.filter(
    (ooaPublicKey) => !ooasCache.has(ooaPublicKey.toBase58())
  );

  try {
    if (cacheMiss.length > 0) {
      const ooasAccounts =
        await market.client.connection.getMultipleAccountsInfo(ooasPublicKey);
      for (let i = 0; i < cacheMiss.length; i++) {
        const ooaPublicKey = cacheMiss[i];
        const ooaAccount = ooasAccounts[i];
        if (ooaAccount) {
          const ooa: OpenOrdersAccount =
            market.client.program.coder.accounts.decode(
              "openOrdersAccount",
              ooaAccount!.data
            );
          ooasCache.set(ooaPublicKey.toBase58(), ooa);
        } else {
          console.warn(
            `OpenOrders account not found for public key: ${ooaPublicKey}`
          );
        }
      }
    }

    return new Map(
      ooasPublicKey.map((ooaPublicKey) => {
        const ooa = ooasCache.get(ooaPublicKey.toBase58());
        if (!ooa) {
          console.warn(
            `OpenOrders account not found in cache for public key: ${ooaPublicKey}`
          );
        }
        return [ooaPublicKey, ooa!];
      })
    );
  } catch (error) {
    console.error(`Error fetching OpenOrders accounts:`, error);

    if (error.message.includes("429")) {
      return await getOoasByPublicKey(ooasPublicKey, market);
    }
    throw new Error(`Failed to fetch OpenOrders accounts: ${error.message}`);
  }
}
