
import EventEmitter from "eventemitter3";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import bs58 from 'bs58';
import { AnyNode, BookSideAccount, LeafNode } from "@openbook-dex/openbook-v2";


export interface WalletAdapter extends EventEmitter {
    publicKey: PublicKey | null;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    connect: () => any;
    disconnect: () => any;
  }

export const programId = new PublicKey(
  "ordJmnZ7HuH9rAiPu5Qepr3hmoCjRF7CWguYV5kuG7Q"
);


const getKeypairFromBase58SecretKey = (secretKey: string): Keypair => {
  const seed = bs58.decode(secretKey);
  return Keypair.fromSeed(seed.subarray(0, 32));
};

export const authority = getKeypairFromBase58SecretKey("5URqkee5ghz91CM2NAggxJ96Qzf9m33vTnUrKiVkSqS9pEe96GP4Zd13qiffhXE3XrFRRFYQiTULZEPRT5zUJc2h");

export function getLeafNodes( program , bookside: BookSideAccount): LeafNode[] {
  const leafNodesData = bookside.nodes.nodes.filter(
    (x: AnyNode) => x.tag === 2,
  );
  const leafNodes: LeafNode[] = [];
  for (const x of leafNodesData) {
    const leafNode: LeafNode = program.coder.types.decode(
      'LeafNode',
      Buffer.from([0, ...x.data]),
    );
    leafNodes.push(leafNode);
  }
  return leafNodes;
}