
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from '@tanstack/react-query';
import { getRecentTrades } from '@/lib/openbook';
import { Loader } from 'lucide-react';

interface TradeHistoryProps {
  market: string;
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ market }) => {
  const { data: trades, isLoading } = useQuery({
    queryKey: ['trades', market],
    queryFn: () => getRecentTrades(market),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Sample open orders data (would come from wallet connection in production)
  const openOrders = [
    { id: '1', type: 'Buy', pair: market, amount: '5.00', price: '98.45', status: 'Open' },
    { id: '2', type: 'Sell', pair: market, amount: '2.50', price: '98.75', status: 'Partially Filled' },
  ];

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
            <div>Price</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          
          <ScrollArea className="h-32">
            {openOrders.map((order) => (
              <div key={order.id} className="grid grid-cols-6 gap-4 text-sm p-2 hover:bg-gray-800 rounded">
                <div className={order.type === 'Buy' ? 'text-green-400' : 'text-red-400'}>
                  {order.type}
                </div>
                <div>{order.pair}</div>
                <div>{order.amount}</div>
                <div>${order.price}</div>
                <div className="text-yellow-400">{order.status}</div>
                <div>
                  <button className="text-red-400 hover:text-red-300 text-xs">Cancel</button>
                </div>
              </div>
            ))}
          </ScrollArea>
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
          ) : trades && trades.length > 0 ? (
            <ScrollArea className="h-32">
              {trades.map((trade) => (
                <div key={trade.id} className="grid grid-cols-5 gap-4 text-sm p-2 hover:bg-gray-800 rounded">
                  <div className={trade.type === 'Buy' ? 'text-green-400' : 'text-red-400'}>
                    {trade.type}
                  </div>
                  <div>{market}</div>
                  <div>{trade.size}</div>
                  <div>${trade.price}</div>
                  <div className="text-gray-400">{trade.time}</div>
                </div>
              ))}
            </ScrollArea>
          ) : (
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
