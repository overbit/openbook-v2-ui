
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { getOpenOrders, getRecentTrades, RPCenv } from '@/lib/openbook';
import { useOpenbookClient } from '@/hooks/useOpenbookClient';
import { ExternalLink, Loader } from 'lucide-react';

interface TradeHistoryProps {
  marketSymbol: string;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ marketSymbol }) => {
  const openbookClient = useOpenbookClient();

  const { data: trades, isLoading } = useQuery({
    queryKey: ['trades', marketSymbol],
    queryFn: () => marketSymbol && getRecentTrades(marketSymbol, openbookClient),
    refetchInterval: 2000, // Refetch every 2 seconds
  });
    
    const { data: openOrders, isLoading : isLoadingOpenOrders } = useQuery({
      queryKey: ['getOpenOrders', marketSymbol],
      queryFn: () => getOpenOrders(marketSymbol, openbookClient),
      refetchInterval: 5000, // Refetch every 5 seconds
    });

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };
  const openSolanaExplorer = (address: string) => {
    window.open(`https://explorer.solana.com/address/${address}/?cluster=${RPCenv}`, '_blank');
  };
  
  return (
    <div className="p-4">
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="orders">Open Orders</TabsTrigger>
          <TabsTrigger value="history">Trade History</TabsTrigger>
          <TabsTrigger value="fills">Order Fills</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <div className="grid grid-cols-6 gap-4 text-sm text-gray-400 mb-2 p-2">
            <div>Type</div>
            <div>Pair</div>
            <div>Amount</div>
            <div>Account</div>
            <div>Price</div>
            <div>Status</div>
            {/* <div>Action</div> */}
          </div>
          
        {isLoadingOpenOrders ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="animate-spin h-6 w-6 mr-2" />
              <span>Loading trade history...</span>
            </div>
          ) :
          <ScrollArea className="h-80">
            {openOrders.map((order) => (
              <div key={order.seqNum} className="grid grid-cols-6 gap-4 text-sm p-2 hover:bg-gray-800 rounded">
                <div className={order.side === 'Buy' ? 'text-green-400' : 'text-red-400'}>
                  {order.side}
                </div>
                <div>{order.marketName}</div>
                <div>{order.amount}</div>
                <div className="flex items-center gap-2">
                    <span className="text-blue-400">{shortenAddress(order.ownerAddress)}</span>
                    <button 
                      onClick={() => openSolanaExplorer(order.ownerAddress)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ExternalLink size={12} />
                    </button>
                  </div>
                <div>${order.price}</div>
                <div className="text-yellow-400">{order.isExpired? 'Expired' : 'Open'}</div>
                {/* <div>
                  <button className="text-red-400 hover:text-red-300 text-xs">Cancel</button>
                </div> */}
              </div>
            ))}
          </ScrollArea>
  }
        </TabsContent>
        
        <TabsContent value="history">
          <div className="grid grid-cols-5 gap-4 text-sm text-gray-400 mb-2 p-2">
            <div>Type</div>
            <div>Pair</div>
            <div>Amount</div>
            <div>Price</div>
            <div>Time</div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader className="animate-spin h-6 w-6 mr-2" />
              <span>Loading trade history...</span>
            </div>
          ) :
           trades && trades.length > 0 ? (
            <ScrollArea className="h-32">
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
            </ScrollArea>
          ) : 
          (
            <div className="text-center text-gray-400 py-8">
              No trade history available
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="fills">
          <div className="text-center text-gray-400 py-8">
            No order fills to display
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradeHistory;
