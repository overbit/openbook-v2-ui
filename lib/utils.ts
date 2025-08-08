import EventEmitter from "eventemitter3";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import bs58 from "bs58";
import { OPENBOOK_PROGRAM_ID as LIB_OPENBOOK_PROGRAM_ID } from "@openbook-dex/openbook-v2";
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
export const SOLANA_RPC_URL = "https://api.devnet.solana.com";
export const SOLANA_ENV = "devnet";

const getKeypairFromBase58SecretKey = (secretKey: string): Keypair => {
  const seed = bs58.decode(secretKey);
  return Keypair.fromSeed(seed.subarray(0, 32));
};

export const authority = getKeypairFromBase58SecretKey(
  "5URqkee5ghz91CM2NAggxJ96Qzf9m33vTnUrKiVkSqS9pEe96GP4Zd13qiffhXE3XrFRRFYQiTULZEPRT5zUJc2h"
);

/**
 * Shortens a Solana address to show the first and last few characters for display
 * @param address The full Solana address
 * @param prefixLength Number of characters to show at the beginning (default: 4)
 * @param suffixLength Number of characters to show at the end (default: 4)
 * @returns Shortened address in the format "prefix...suffix"
 */
export const shortenAddress = (
  address: string,
  prefixLength = 4,
  suffixLength = 4
): string => {
  if (!address) return "";
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
};

/**
 * Generates a URL to view the address on Solana Explorer
 * @param address The Solana address to view
 * @returns URL to Solana Explorer for the address
 */
export const getSolanaExplorerLink = (address: string): string => {
  return `https://explorer.solana.com/address/${address}?cluster=${SOLANA_ENV}`;
};

/**
 * Generates a URL to view the address on Solscan
 * @param address The Solana address to view
 * @returns URL to Solscan for the address
 */
export const getSolscanLink = (address: string): string => {
  return `https://solscan.io/address/${address}?cluster=${SOLANA_ENV}`;
};

/**
 * Opens the address in Solana Explorer in a new tab
 * @param address The Solana address to view
 */
export const openSolanaExplorer = (address: string): void => {
  window.open(getSolanaExplorerLink(address), "_blank");
};

/**
 * Opens the address in Solscan in a new tab
 * @param address The Solana address to view
 */
export const openSolscan = (address: string): void => {
  window.open(getSolscanLink(address), "_blank");
};
