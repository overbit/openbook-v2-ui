import Head from "next/head";
import { useEffect, useState } from "react";
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
import { fetchData, getMarket, RPC } from "../utils/openbook";
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
import { getBooksideOrders } from "../utils/utils";
import MarketDetail from "../components/MarketDetail";
import MarketTable from "../components/MarketTable";
import OrderBook from "../components/OrderBook";

export default function Home() {
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
        
        
       
      <div> 
        { market.asks? 
          MarketDetail({market} 
          ): <h1 className="text-center">This market has been closed!</h1>}
        <button
          className="items-center text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={(e: any) => crankMarket()}
        >
          CRANK
        </button>
{OrderBook({asks, bids, market})}
        
      </div>
        <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
          <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
              © 2023{" "}
              <a
                href="https://twitter.com/openbookdex"
                className="hover:underline"
              >
                Openbook Team
              </a>
              . All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
              <li>
                <a
                  href="https://twitter.com/openbookdex"
                  className="mr-4 hover:underline md:mr-6"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/openbook-dex"
                  className="mr-4 hover:underline md:mr-6"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="gofuckyourselfifyouwanttocontactus@weloveyou.shit"
                  className="hover:underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}
