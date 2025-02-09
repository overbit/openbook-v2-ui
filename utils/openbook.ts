import {
  MarketAccount,
  BookSideAccount,
  OPENBOOK_PROGRAM_ID,
  OpenBookV2Client,
  OpenbookV2,
  IDL,
  sleep,
  Market,
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
  const [eventAuthority] = PublicKey.findProgramAddressSync(
    [Buffer.from('__event_authority')],
    programId
  );
  const marketsAll = [];
  const BATCH_TX_SIZE = 50;

  const signatures = (
    await connection.getSignaturesForAddress(eventAuthority)
  )
    .filter((x) => x.err === null)
    .map((x) => x.signature);

  const batchSignatures: [string[]] = [[]];
  for (let i = 0; i < signatures.length; i += BATCH_TX_SIZE) {
    batchSignatures.push(signatures.slice(0, BATCH_TX_SIZE));
  }
  for (const batch of batchSignatures) {
    const allTxs = await connection.getTransactions(batch, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });
    for (const tx of allTxs) {
      if (
        tx?.meta?.innerInstructions !== null &&
        tx?.meta?.innerInstructions !== undefined
      ) {
        for (const innerIns of tx.meta.innerInstructions) {
          const innerIx = innerIns.instructions?.[11];
          if (innerIx?.accounts?.[0] !== undefined) {
            // validate key and program key
            const eventAuthorityKey = innerIx.accounts[0];
            const programKey = innerIx.programIdIndex;
            if (
              (tx.transaction.message as Message).staticAccountKeys[
                eventAuthorityKey
              ].toString() !== eventAuthority.toString() ||
              (tx.transaction.message as Message).staticAccountKeys[
                programKey
              ].toString() !== programId.toString()
            ) {
              continue;
            } else {
              const ixData = utils.bytes.bs58.decode(innerIx.data);
              const eventData = utils.bytes.base64.encode(ixData.slice(8));
              const event = program.coder.events.decode(eventData);

              if (event != null) {
                const market = {
                  market: (event.data.market as PublicKey).toString(),
                  baseMint: (event.data.baseMint as PublicKey).toString(),
                  quoteMint: (event.data.quoteMint as PublicKey).toString(),
                  name: event.data.name as string,
                  timestamp: tx.blockTime,
                };
                marketsAll.push(market);
              }
            }
          }
        }
      }
    }
    sleep(5000);
  }

  return marketsAll;
}

export const fetchData = async (provider: AnchorProvider) => {
  const connection = useHookConnection();

  let markets = await findAllMarkets(connection, provider, new PublicKey("ordJmnZ7HuH9rAiPu5Qepr3hmoCjRF7CWguYV5kuG7Q"));
  return markets;
};

export const getMarket = async (
  client: OpenBookV2Client,
  publicKey: string
): Promise<Market> => {
  let market = await Market.load(client, new PublicKey(publicKey));
  return market ? market : ({} as Market);
};
