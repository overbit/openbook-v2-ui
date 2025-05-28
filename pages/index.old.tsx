import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@nextui-org/react";

import React from "react";
import { fetchData, getMarket, RPC } from "../lib/openbook";
import { BN } from "@coral-xyz/anchor";

import { LinkIcon } from "@heroicons/react/24/outline";
import {
  MarketAccount,
  nameToString,
  Order,
} from "@openbook-dex/openbook-v2";
import { useOpenbookClient } from "../hooks/useOpenbookClient";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { ButtonState } from "../components/Button";
import { toast } from "react-hot-toast";
import { getBooksideOrders } from "../lib/utils";
import MarketDetail from "../components/MarketDetail";
import MarketTable from "../components/MarketTable";
import OrderBook from "../components/OrderBook";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const ref = useRef(null)
  const { publicKey, signTransaction, connected, wallet } = useWallet();
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [bestBid, setBestBid] = useState<Order>();
  const [bestAsk, setBestAsk] = useState<Order>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [markets, setMarkets] = useState([
    { market: "", baseMint: "", quoteMint: "", name: "" },
  ]);
  const [market, setMarket] = useState({} as MarketAccount);
  const [marketPubkey, setMarketPubkey] = useState(PublicKey.default);
  const [txState, setTxState] = React.useState<ButtonState>("initial");

  const columns = [
    {
      key: "name",
      label: "NAME",
    },
    {
      key: "market",
      label: "Pubkey",
    },
    {
      key: "baseMint",
      label: "Base Mint",
    },
    {
      key: "quoteMint",
      label: "Quote Mint",
    },
  ];

  const columnsBook = [
    {
      key: "owner",
      label: "OWNER",
    },
    {
      key: "quantity",
      label: "SIZE",
    },
    {
      key: "key",
      label: "PRICE",
    },
  ];

  const openbookClient = useOpenbookClient();
  const provider = openbookClient.provider;

  useEffect(() => {
    fetchData(provider)
      .then((res) => {
        setMarkets(res);
        fetchMarket(res[0].market.toString());
        setMarketPubkey(new PublicKey(res[0].market));
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const fetchMarket = async (key: string) => {
    const market = await getMarket(openbookClient, key);
    if(!market){
      setMarkets(markets.filter((m) => m.market !== key));
      return;
    }

    setMarket(market.account);
    setMarketPubkey(new PublicKey(key));

    
    const booksideAsks = await market.loadAsks();
    const booksideBids = await market.loadBids();
    if (booksideAsks === null || booksideBids === null) return;

    const asks = getBooksideOrders(booksideAsks).sort(
      (a, b) => a.price - b.price
    );
    const bids = getBooksideOrders(booksideBids).sort(
      (a, b) => b.price - a.price
    );
    setBestAsk(booksideAsks.best());
    setBestBid(booksideBids.best());
    setAsks(asks);
    setBids(bids);
  };

  const linkedPk = (pk: string) => (
    <div>
      {pk}
      <a
        href={`https://solscan.io/account/${pk}?${RPC.indexOf('devnet') ? 'cluster=devnet' : ''}`}
        target="_blank"
        className="pl-2"
      >
        <LinkIcon className="w-4 h-4 inline" />
      </a>
    </div>
  );

  const crankMarket = async () => {
    let accountsToConsume = await openbookClient.getAccountsToConsume(market);
    console.log("accountsToConsume", accountsToConsume);

    if (accountsToConsume.length > 0) {
      const ix = await openbookClient.consumeEventsIx(
        marketPubkey,
        market,
        new BN(5),
        accountsToConsume
      );

      const tx = await openbookClient.sendAndConfirmTransaction([ix]);
      console.log("consume events tx", tx);
      toast("Consume events tx: " + tx.toString());
    }
  };

  return (
    <div>
      <Head>
        <title>Openbook</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full h-full relative ">
      {MarketTable({columns, fetchMarket, markets})}
        
        
       
        { market.asks? 
          MarketDetail({market, bestAsk, bestBid} 
          ): <h1 className="text-center">This market has been closed!</h1>}

{OrderBook({asks, bids, market})}

        <button
          className="items-center text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e: any) => crankMarket()}
        >
          CRANK
        </button>
      </div>

      {Footer({ className :""})}
    </div>
  );
}
