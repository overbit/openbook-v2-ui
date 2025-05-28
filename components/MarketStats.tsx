
import React from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketStatsProps {
  market: string;
  stats: any;
  isLoading: boolean;
}

const MarketStats = ({ market, stats, isLoading }: MarketStatsProps) => {
  if (isLoading) {
    return (
      <Card className="bg-gray-900 border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="animate-pulse">Loading market stats...</div>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-gray-900 border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="text-gray-400">No market data available</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <div className="text-sm text-gray-400">Price</div>
          <div className={`text-lg font-bold ${stats.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            ${stats.price}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400">24h Change</div>
          <div className={`flex items-center ${stats.isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {stats.isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {stats.change}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400">24h High</div>
          <div className="text-white">${stats.high24h}</div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400">24h Low</div>
          <div className="text-white">${stats.low24h}</div>
        </div>
        
        <div>
          <div className="text-sm text-gray-400">24h Volume</div>
          <div className="text-white">{stats.volume24h}</div>
        </div>
      </div>
    </Card>
  );
};

export default MarketStats;
