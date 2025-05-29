import { useOpenbookClient } from "@/hooks/useOpenbookClient";
import { getOrderbook } from "@/lib/openbook";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

interface OrderBookProps {
  market: string;
}

const OrderBook: React.FC<OrderBookProps> = ({ market }) => {
  const openbookClient = useOpenbookClient();
  
  const { data, isLoading } = useQuery({
    queryKey: ['orderbook', market],
    queryFn: () => getOrderbook(market, openbookClient),
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  
  const sellOrders = data?.asks || [];
  const buyOrders = data?.bids || [];

  // Calculate spread and current price
  const lowestAsk = sellOrders.length > 0 ? sellOrders[0]?.price : 0;
  const highestBid = buyOrders.length > 0 ? buyOrders[0]?.price : 0;
  const spread = lowestAsk && highestBid ? (lowestAsk - highestBid).toFixed(2) : '--';
  const currentPrice = lowestAsk || highestBid || '--';

  // Calculate max sizes for background opacity
  const maxSellSize = Math.max(...sellOrders.map(order => order.size), 0);
  const maxBuySize = Math.max(...buyOrders.map(order => order.size), 0);

  const getBackgroundOpacity = (size: number, maxSize: number) => {
    if (maxSize === 0) return 0;
    return Math.min(size / maxSize, 1) * 0.3; // Max 30% opacity
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-center">Order Book</h3>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader className="animate-spin h-6 w-6 mr-2" />
          <span>Loading order book...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sell Orders (Left Side) */}
          <div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-2 p-2 border-b border-gray-700">
              <div>Price ({data.quoteSymbol})</div>
              <div className="text-right">Size</div>
              <div className="text-right">Total</div>
            </div>
            
            <ScrollArea className="h-64">
              <div className="space-y-1">
                {[...sellOrders].reverse().map((order, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 text-xs p-2 rounded relative"
                    style={{
                      backgroundColor: `rgba(239, 68, 68, ${getBackgroundOpacity(order.size, maxSellSize)})`
                    }}
                  >
                    <div className="text-red-400 font-medium">{order.price.toFixed(2)}</div>
                    <div className="text-right text-white">{order.size.toFixed(3)}</div>
                    <div className="text-right text-gray-400">{order.total.toFixed(3)}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Buy Orders (Right Side) */}
          <div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-2 p-2 border-b border-gray-700">
              <div>Price ({data.quoteSymbol})</div>
              <div className="text-right">Size</div>
              <div className="text-right">Total</div>
            </div>
            
            <ScrollArea className="h-64">
              <div className="space-y-1">
                {buyOrders.map((order, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-3 gap-2 text-xs p-2 rounded relative"
                    style={{
                      backgroundColor: `rgba(34, 197, 94, ${getBackgroundOpacity(order.size, maxBuySize)})`
                    }}
                  >
                    <div className="text-green-400 font-medium">{order.price.toFixed(2)}</div>
                    <div className="text-right text-white">{order.size.toFixed(3)}</div>
                    <div className="text-right text-gray-400">{order.total.toFixed(3)}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}
      
      {/* Current Price and Spread - Centered */}
      <div className="mt-6 p-3 bg-gray-800 rounded text-center">
        <div className="text-green-400 font-bold text-xl">
          ${typeof currentPrice === 'number' ? currentPrice.toFixed(2) : currentPrice}
        </div>
        <div className="text-sm text-gray-400">Spread: ${spread}</div>
      </div>
    </div>
  );
};

export default OrderBook;
