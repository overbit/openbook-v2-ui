
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PortfolioProps {
  market?: string;
}

const Portfolio = ({ market }: PortfolioProps) => {
  const balances = [
    { token: 'SOL', amount: 15.75, value: '$1,551.23' },
    { token: 'USDC', amount: 1250.00, value: '$1,250.00' },
    { token: 'BTC', amount: 0.025, value: '$1,075.50' },
    { token: 'ETH', amount: 0.85, value: '$2,125.75' },
  ];

  const totalValue = '$6,002.48';

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Portfolio</h3>
        <div className="text-sm text-gray-400">Total: {totalValue}</div>
      </div>
      
      <ScrollArea className="h-48">
        <div className="space-y-2">
          {balances.map((balance, index) => (
            <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-800 rounded">
              <div>
                <div className="font-medium">{balance.token}</div>
                <div className="text-sm text-gray-400">{balance.amount.toFixed(3)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">{balance.value}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Portfolio;
