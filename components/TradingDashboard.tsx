
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Header from './Header';
import OrderBook from './TradingOrderbook';
import TradingChart from './TradingChart';
import TradeHistory from './TradeHistory';
import MarketStats from './MarketStats';
import { useQuery } from '@tanstack/react-query';
import { getAvailableMarkets, getHistoricalPrices, getMarketStats, initializeMarkets } from '@/lib/openbook';
import { useFakeProvider, useOpenbookClient } from '@/hooks/useOpenbookClient';

const TradingDashboard = () => {
  const [availableMarkets, setAvailableMarkets] = useState<string[]>([]);
  const [selectedMarket, setSelectedMarket] = useState('');

  const openbookClient = useOpenbookClient();
    // Initialize markets on component mount
  useEffect(() => {
    const init = async () => {
      try {
        const markets = await getAvailableMarkets(useFakeProvider());
        const marketSymbols = markets.map(m => m.symbol).filter(Boolean);
        setAvailableMarkets(marketSymbols);
        
        // Set default market to first available
        if (marketSymbols.length > 0 && !selectedMarket) {
          setSelectedMarket(marketSymbols[0]);
        }
      } catch (error) {
        console.error('Failed to initialize markets:', error);
        // Fallback to a default market name
        // setSelectedMarket('SOL/USDC');
        // setAvailableMarkets(['SOL/USDC']);
      }
    };
    
    init();
  }, []);

  

  const { data: marketStats, isLoading: statsLoading } = useQuery({
    queryKey: ['marketStats', selectedMarket],
    queryFn: () => getMarketStats(selectedMarket, openbookClient),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['chartData', selectedMarket],
    queryFn: () => getHistoricalPrices(selectedMarket,openbookClient),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

    // Don't render until we have a selected market
  if (!selectedMarket) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading markets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header selectedMarket={selectedMarket} onMarketChange={setSelectedMarket} availableMarkets={availableMarkets}/>
      
      <div className="container mx-auto p-4 space-y-4">
        <MarketStats market={selectedMarket} stats={marketStats} isLoading={statsLoading} />
        
        {/* Full Width Order Book */}
        <Card className="bg-gray-900 border-gray-800">
          <OrderBook market={selectedMarket} />
        </Card>
        
        {/* Trade History */}
        <Card className="bg-gray-900 border-gray-800">
          <TradeHistory market={selectedMarket} />
        </Card>
        
        {/* Chart Section */}
        {/* <Card className="bg-gray-900 border-gray-800 h-96">
          <TradingChart market={selectedMarket} data={chartData} isLoading={chartLoading} />
        </Card> */}
      </div>
    </div>
  );
};

export default TradingDashboard;
