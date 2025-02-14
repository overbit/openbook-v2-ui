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
        <div className="flex flex-col gap-3 pb-2.5">
          <Table
            isStriped
            selectionMode="single"
            aria-label="Markets"
            onRowAction={async (key) => fetchMarket(key.toString())}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={markets}>
              {(item) => (
                <TableRow key={item.market}>
                  {(columnKey) => (
                    <TableCell>
                      {columnKey == "name"
                        ? getKeyValue(item, columnKey)
                        : linkedPk(getKeyValue(item, columnKey))}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {market.asks ? (
          <div>
            <div className="grid grid-cols-3 gap-2 text-center border-r-4 border-b-4 border-l-4">
              <div className="">
                <p className="font-bold">Name </p>
                {market.asks ? nameToString(market.name) : ""}
                <p className="font-bold">Base Mint </p>
                {market.asks ? market.baseMint.toString() : ""}
                <p className="font-bold">Quote Mint </p>
                {market.asks ? market.quoteMint.toString() : ""}
                <p className="font-bold">Bids </p>
                {market.asks ? market.bids.toString() : ""}
                <p className="font-bold">Asks </p>
                {market.asks ? market.asks.toString() : ""}
                <p className="font-bold">Event Heap </p>
                {market.asks ? market.eventHeap.toString() : ""}
              </div>

              <div className="">
                <p className="font-bold">Base Deposits </p>
                {market.asks ? market.baseDepositTotal.toString() : ""}
                <p className="font-bold">Quote Deposits </p>
                {market.asks ? market.quoteDepositTotal.toString() : ""}
                <p className="font-bold">Taker Fees </p>
                {market.asks ? market.takerFee.toString() : ""}
                <p className="font-bold">Maker Fees </p>
                {market.asks ? market.makerFee.toString() : ""}
                <p className="font-bold">Base Lot Size </p>
                {market.asks ? market.baseLotSize.toString() : ""}
                <p className="font-bold">Quote Lot Size </p>
                {market.asks ? market.quoteLotSize.toString() : ""}
                <p className="font-bold">Base Decimals </p>
                {market.asks ? market.baseDecimals : ""}
                <p className="font-bold">Quote Decimals </p>
                {market.asks ? market.quoteDecimals : ""}
              </div>
              <div className="">
                <p className="font-bold">Best Ask </p>
                {bestAsk ? bestAsk?.price : ""}
                <p className="font-bold">Best Bid </p>
                {bestBid ? bestBid?.price : "NA"}
              </div>
            </div>

            <button
              className="items-center text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={(e: any) => crankMarket()}
            >
              CRANK
            </button>

            <div>
              <h3 className="text-center mt-8 mb-5 text-xl">
                ASKS -------- The Book -------- BIDS
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 border-2">
              <Table isStriped selectionMode="single" aria-label="OrderBook">
                <TableHeader className="text-left" columns={columnsBook}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={asks}>
                  {(item) => (
                    <TableRow key={item.price}>
                      {(columnKey) => (
                        <TableCell>
                          {columnKey == "owner"
                            ? item.leafNode.owner
                                .toString()
                                .substring(0, 4) +
                              ".." +
                              item.leafNode.owner.toString().slice(-4)
                            : columnKey == "quantity"
                            ? item.size.toString()
                            : item.price}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <Table isStriped selectionMode="single" aria-label="OrderBook">
                <TableHeader columns={columnsBook}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody items={bids}>
                {(item) => (
                    <TableRow key={item.price}>
                      {(columnKey) => (
                        <TableCell>
                          {columnKey == "owner"
                            ? item.leafNode.owner
                                .toString()
                                .substring(0, 4) +
                              ".." +
                              item.leafNode.owner.toString().slice(-4)
                            : columnKey == "quantity"
                            ? item.size.toString()
                            : item.price}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <h1 className="text-center">This market has been closed!</h1>
        )}

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
