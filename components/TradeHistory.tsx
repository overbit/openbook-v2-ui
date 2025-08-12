import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import {
  getOpenOrders,
  getRecentOrderFills,
  getRecentTrades,
  Side,
} from "@/lib/openbook";
import { useOpenbookClient } from "@/hooks/useOpenbookClient";
import { Loader } from "lucide-react";
import { SolanaExplorer } from "./solana-explorer";

interface TradeHistoryProps {
  marketSymbol: string;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ marketSymbol }) => {
  const openbookClient = useOpenbookClient();
  // const { data: trades, isLoading } = useQuery({
  //   queryKey: ["trades", marketSymbol],
  //   queryFn: () => getRecentTrades(marketSymbol, openbookClient),
  //   enabled: !!marketSymbol,
  //   refetchInterval: 2000,
  // });

  const { data: fills, isLoading: isLoadingFills } = useQuery({
    queryKey: ["fills", marketSymbol],
    queryFn: () => getRecentOrderFills(marketSymbol, openbookClient),
    enabled: !!marketSymbol,
    refetchInterval: 10000,
  });

  const { data: openOrders, isLoading: isLoadingOpenOrders } = useQuery({
    queryKey: ["getOpenOrders", marketSymbol],
    queryFn: () => getOpenOrders(marketSymbol, openbookClient),
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  // shortenAddress and openSolanaExplorer are now imported from solanaAddressUtils

  return (
    <div className="p-4">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="orders">Open Orders</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
          <TabsTrigger value="fills">Order Fills</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <div className="grid grid-cols-7 gap-4 text-sm text-gray-400 mb-2 p-2">
            <div>Pair</div>
            <div>OriginalId</div>
            <div>Type</div>
            <div>Size</div>
            <div>Price</div>
            <div>Account</div>
            <div>Status</div>
            {/* <div>Action</div> */}
          </div>

          {isLoadingOpenOrders ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="animate-spin h-6 w-6 mr-2" />
              <span>Loading trade history...</span>
            </div>
          ) : (
            <ScrollArea>
              {openOrders?.map((order) => (
                <div
                  key={order.seqNum}
                  className="grid grid-cols-7 gap-4 text-sm p-2 hover:bg-gray-800 rounded"
                >
                  <div>{order.marketName}</div>
                  <div>{order.originalOrderId}</div>
                  <div
                    className={
                      order.side === "Buy" ? "text-green-400" : "text-red-400"
                    }
                  >
                    {order.side}
                  </div>
                  <div>{order.amount}</div>
                  <div>${order.price}</div>
                  <SolanaExplorer address={order.ownerAddress!} />
                  <div className="text-yellow-400">
                    {order.isExpired ? "Expired" : "Open"}
                  </div>
                  {/* <div>
                  <button className="text-red-400 hover:text-red-300 text-xs">Cancel</button>
                </div> */}
                </div>
              ))}
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-5 gap-4 text-sm text-gray-400 mb-2 p-2">
            <div>Type</div>
            <div>Pair</div>
            <div>Amount</div>
            <div>Price</div>
            <div>Time</div>
          </div>

          {/* {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="animate-spin h-6 w-6 mr-2" />
              <span>Loading trade history...</span>
            </div>
          ) : trades && trades.length > 0 ? (
            <ScrollArea className="h-32"> */}
          {/* {trades.map((trade) => (
                <div key={trade.index} className="grid grid-cols-5 gap-4 text-sm p-2 hover:bg-gray-800 rounded">
                  <div className={trade.type === 'Buy' ? 'text-green-400' : 'text-red-400'}>
                    {trade.type}
                  </div>
                  <div>{market}</div>
                  <div>{trade.size}</div>
                  <div>${trade.price}</div>
                  <div className="text-gray-400">{trade.time}</div>
                </div>
              ))} */}
          {/* </ScrollArea>
          ) : ( */}
          <div className="text-center text-gray-400 py-8">
            {/* No trade history available */}
            <span>Coming soon...</span>
          </div>
          {/* )} */}
        </TabsContent>

        <TabsContent value="fills">
          <div className="grid grid-cols-6 gap-4 text-sm text-gray-400 mb-2 p-2">
            <div>OriginalId</div>
            <div>Type</div>
            <div>Size</div>
            <div>Price</div>
            <div>Account</div>
            <div>Timestamp</div>
          </div>
          {isLoadingFills ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="animate-spin h-6 w-6 mr-2" />
              <span>Loading trade history...</span>
            </div>
          ) : fills && fills.length > 0 ? (
            <ScrollArea>
              {fills.map((fill) => (
                <>
                  <div
                    key={fill.seqNum}
                    className="grid grid-cols-6 gap-4 text-sm p-2 hover:bg-gray-800 rounded"
                  >
                    <div>${fill.takerClientOrderId}</div>
                    <div
                      className={
                        fill.takerSide === Side.Bid
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {fill.takerSide}
                    </div>
                    <div>{fill.amount}</div>
                    <div>{fill.price}</div>
                    <SolanaExplorer address={fill.takerOoa.toBase58()} />
                    <div>{fill.timestamp.toISOString()}</div>
                  </div>
                  <div
                    key={fill.seqNum}
                    className="grid grid-cols-6 gap-4 text-sm p-2 hover:bg-gray-800 rounded"
                  >
                    <div>${fill.makerClientOrderId}</div>
                    <div
                      className={
                        fill.takerSide === Side.Ask
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {fill.takerSide === Side.Ask ? Side.Bid : Side.Ask}
                    </div>
                    <div>{fill.amount}</div>
                    <div>{fill.price}</div>
                    <SolanaExplorer address={fill.makerOoa!.toBase58()} />
                    <div>{fill.timestamp.toISOString()}</div>
                  </div>
                </>
              ))}
            </ScrollArea>
          ) : (
            <div className="text-center text-gray-400 py-8">
              {/* No trade history available */}
              <span>No order fills to be consumed</span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradeHistory;
