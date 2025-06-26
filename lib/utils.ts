import EventEmitter from "eventemitter3";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import {
  OPENBOOK_PROGRAM_ID as LIB_OPENBOOK_PROGRAM_ID,
  Order,
  BookSide,
} from "@openbook-dex/openbook-v2";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface WalletAdapter extends EventEmitter {
  publicKey: PublicKey | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  connect: () => any;
  disconnect: () => any;
}

// export const OPENBOOK_PROGRAM_ID = new PublicKey(
//   "ordJmnZ7HuH9rAiPu5Qepr3hmoCjRF7CWguYV5kuG7Q"
// );
export const OPENBOOK_PROGRAM_ID = LIB_OPENBOOK_PROGRAM_ID;

export const OPENBOOK_MARKET_ADMIN =
  "9a1nsA5o2AcD86VoyupeMc6nEuuQQ9StVxq34kea9Bmz";

// MAINNET
//  export const SOLANA_RPC_URL = "https://misty-wcb8ol-fast-mainnet.helius-rpc.com/";
// DEVNET
export const SOLANA_RPC_URL =
  "https://skilled-powerful-leaf.solana-devnet.quiknode.pro/1cc7cc4d47403a18c9c63e4407849e4ac3767572/";
export const SOLANA_ENV = "devnet";

const getKeypairFromBase58SecretKey = (secretKey: string): Keypair => {
  const seed = bs58.decode(secretKey);
  return Keypair.fromSeed(seed.subarray(0, 32));
};

export const authority = getKeypairFromBase58SecretKey(
  "5URqkee5ghz91CM2NAggxJ96Qzf9m33vTnUrKiVkSqS9pEe96GP4Zd13qiffhXE3XrFRRFYQiTULZEPRT5zUJc2h"
);
