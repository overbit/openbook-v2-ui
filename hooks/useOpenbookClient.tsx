import { OpenBookV2Client } from "@openbook-dex/openbook-v2";
import { Connection, Keypair } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import EmptyWallet from "./emptyWallet";
import { OPENBOOK_PROGRAM_ID, SOLANA_RPC_URL } from "@/lib/utils";

export function useOpenbookClient(): OpenBookV2Client {
  const provider = useProvider();

  const client = new OpenBookV2Client(provider, OPENBOOK_PROGRAM_ID);
  return client;
}

export function useProvider(): AnchorProvider {
  return new AnchorProvider(
    new Connection(SOLANA_RPC_URL),
    new EmptyWallet(Keypair.generate()),
    {
      /** disable transaction verification step */
      skipPreflight: true,
      /** desired commitment level */
      commitment: "confirmed",
      /** preflight commitment level */
      preflightCommitment: "confirmed",
      /** Maximum number of times for the RPC node to retry sending the transaction to the leader. */
      maxRetries: 3,
      /** The minimum slot that the request can be evaluated at */
      minContextSlot: 10,
    }
  );
}
