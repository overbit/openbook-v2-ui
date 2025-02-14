import {
  MarketAccount,
  BookSideAccount,
  OPENBOOK_PROGRAM_ID,
  OpenBookV2Client,
  OpenbookV2,
  IDL,
  sleep,
  Market,
  nameToString,
} from "@openbook-dex/openbook-v2";
import { Message, PublicKey } from "@solana/web3.js";
import {
  useOpenbookClient,
  useHookConnection,
  useFakeProvider,
} from "../hooks/useOpenbookClient";
import { AnchorProvider, Program, utils, Wallet } from "@coral-xyz/anchor";
import { authority, programId } from "./utils";
import { useProvider } from "../hooks/useProvider";

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
  const connection = useHookConnection();
const markets = await findAllMarkets(connection, provider, programId);
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
    
  }
  return null;
};
