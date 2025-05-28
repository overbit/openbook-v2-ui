
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  selectedMarket: string;
  onMarketChange: (market: string) => void;
  availableMarkets?: string[];
}

const Header = ({ selectedMarket, onMarketChange, availableMarkets = [] }: HeaderProps) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <h1 className="text-xl font-bold">Trading Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Market:</span>
            <Select value={selectedMarket} onValueChange={onMarketChange}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select market" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {availableMarkets.length > 0 ? (
                  availableMarkets.map((market) => (
                    <SelectItem key={market} value={market}>
                      {market}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="SOL/USDC">SOL/USDC</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <User className="h-4 w-4 mr-2" />
            Account
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
