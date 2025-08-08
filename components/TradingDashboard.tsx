import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Header from "./Header";
import OrderBook from "./Orderbook";
import TradeHistory from "./TradeHistory";
import MarketStats from "./MarketStats";
import { useQuery } from "@tanstack/react-query";
import {
  getAvailableMarkets,
  getHistoricalPrices,
  getMarket,
  getMarketStats,
  initializeMarkets,
  MarketData,
} from "@/lib/openbook";
import { useProvider, useOpenbookClient } from "@/hooks/useOpenbookClient";
import OrderForm from "./OrderForm";
import Portfolio from "./Portfolio";
import MarketDetails from "./MarketDetails";

const TradingDashboard = () => {
  const [availableMarkets, setAvailableMarkets] = useState<MarketData[]>([]);
  const [selectedMarket, setSelectedMarket] = useState("");
  const [selectedMarketAddress, setSelectedMarketAddress] = useState("");

  const openbookClient = useOpenbookClient();
  // Initialize markets on component mount
  useEffect(() => {
    const init = async () => {
      try {
        const markets = await getAvailableMarkets(useProvider());
        setAvailableMarkets(markets);

        // Set default market to first available
        if (markets.length > 0 && !selectedMarket) {
          setSelectedMarket(markets[0].name);
          setSelectedMarketAddress(markets[0].market);
        }
      } catch (error) {
        console.error("Failed to initialize markets:", error);
        // Fallback to a default market name
        setAvailableMarkets([]);
      }
    };

    init();
  }, []);

  const { data: market, isLoading: marketLoading } = useQuery({
    queryKey: ["market", selectedMarketAddress],
    queryFn: () => getMarket(openbookClient, selectedMarketAddress),
    enabled: !!selectedMarket,
    refetchInterval: 2000, // Refetch every 2 seconds
  });

  const { data: marketStats, isLoading: statsLoading } = useQuery({
    queryKey: ["marketStats", selectedMarket],
    queryFn: () =>
      selectedMarket && getMarketStats(selectedMarket, openbookClient),
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["chartData", selectedMarket],
    queryFn: () =>
      selectedMarket && getHistoricalPrices(selectedMarket, openbookClient),
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
      <Header
        selectedMarket={selectedMarket}
        onMarketChange={setSelectedMarket}
        availableMarkets={availableMarkets}
      />

      <div className="container mx-auto p-4 space-y-4">
        <MarketDetails market={market} isLoading={marketLoading} />

        <MarketStats
          market={selectedMarket}
          stats={marketStats}
          isLoading={statsLoading}
        />

        {/* Full Width Order Book */}
        <Card className="bg-gray-900 border-gray-800">
          <OrderBook market={selectedMarket} />
        </Card>

        {/* Trade History */}
        <Card className="bg-gray-900 border-gray-800">
          <TradeHistory marketSymbol={selectedMarket} />
        </Card>

        {/* Chart Section */}
        {/* <Card className="bg-gray-900 border-gray-800 h-96">
          <TradingChart market={selectedMarket} data={chartData} isLoading={chartLoading} />
        </Card> */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <Portfolio />
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <OrderForm marketSymbol={selectedMarket} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;
