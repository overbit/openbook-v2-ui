import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { getOpenOrders, getRecentOrderEvents, Side } from "@/lib/openbook";
import { useOpenbookClient } from "@/hooks/useOpenbookClient";
import { Loader } from "lucide-react";
import { EventType } from "@openbook-dex/openbook-v2";
import { SolanaExplorer } from "./solana-explorer";

interface TradeHistoryProps {
  marketSymbol: string;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ marketSymbol }) => {
  const openbookClient = useOpenbookClient();
  const { data: events, isLoading: isLoadingFills } = useQuery({
    queryKey: ["events", marketSymbol],
    queryFn: () => getRecentOrderEvents(marketSymbol, openbookClient),
    enabled: !!marketSymbol,
    refetchInterval: 10000,
  });

  const { data: openOrders, isLoading: isLoadingOpenOrders } = useQuery({
    queryKey: ["getOpenOrders", marketSymbol],
    queryFn: () => getOpenOrders(marketSymbol, openbookClient),
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  return (
    <div className="p-4 h-full">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="orders">Open Orders</TabsTrigger>
          <TabsTrigger value="events">Order Events</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <div className="grid grid-cols-7 gap-4 text-sm text-gray-400 mb-2 p-2">
            <div>OriginalId</div>
            <div>Type</div>
            <div>Size</div>
            <div>Price</div>
            <div>Account</div>
            <div>Status</div>
            <div>CreatedAt</div>
            {/* <div>Action</div> */}
          </div>

          {isLoadingOpenOrders ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="animate-spin h-6 w-6 mr-2" />
              <span>Loading open orders...</span>
            </div>
          ) : (
            <ScrollArea>
              {openOrders?.map((order) => (
                <div
                  key={order.seqNum}
                  className="grid grid-cols-7 gap-4 text-sm p-2 hover:bg-gray-800 rounded"
                >
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
                  <div>{order.createdAt}</div>
                </div>
              ))}
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="events">
          <div className="grid grid-cols-8 gap-4 text-sm text-gray-400 mb-2 p-2">
            <div>OriginalId</div>
            <div>Type</div>
            <div>Size</div>
            <div>Price</div>
            <div>Account</div>
            <div>Timestamp</div>
            <div>Event Type</div>
            <div>Event Id</div>
          </div>
          {isLoadingFills ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="animate-spin h-6 w-6 mr-2" />
              <span>Loading trade history...</span>
            </div>
          ) : events && events.length > 0 ? (
            <ScrollArea>
              {events.map((fill) => (
                <div
                  key={`${fill.seqNum}`}
                  className="grid grid-cols-8 gap-4 text-sm p-2 hover:bg-gray-800 rounded"
                >
                  <div>{fill.ownerClientOrderId}</div>
                  <div
                    className={
                      fill.side === Side.Bid ? "text-green-400" : "text-red-400"
                    }
                  >
                    {fill.side}
                  </div>
                  <div>{fill.amount}</div>
                  <div>{fill.price}</div>
                  <SolanaExplorer address={fill.ownerAddress?.toBase58()} />
                  <div>{fill.timestamp.toLocaleString()}</div>
                  <div>{EventType[fill.eventType]}</div>
                  <div>{fill.seqNum}</div>
                </div>
              ))}
            </ScrollArea>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <span>No order events to be consumed</span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradeHistory;
