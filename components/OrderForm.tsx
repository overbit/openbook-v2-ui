
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOpenbookClient } from '@/hooks/useOpenbookClient';
import { useQuery } from '@tanstack/react-query';
import { getRecentTrades } from '@/lib/openbook';

interface OrderFormProps {
  marketSymbol: string;
  accountData: any; // Replace with actual type if available
}

const OrderForm = ({ marketSymbol }) => {
  const [orderType, setOrderType] = useState('market');
  const [price, setPrice] = useState('1.00'); // Default price for limit orders
  const [size, setSize] = useState('');
  const baseToken = marketSymbol.split('/')[0]; // e.g., "{baseToken}"
  const quoteToken = marketSymbol.split('/')[1]; // e.g., "USDC"

  const openbookClient = useOpenbookClient();

  // const { data: trades, isLoading } = useQuery({
  //   queryKey: ['trades', marketSymbol],
  //   queryFn: () => marketSymbol && getRecentTrades(marketSymbol, openbookClient),
  //   refetchInterval: 2000, // Refetch every 2 seconds
  // });

  const accountData= {
    quoteTokenBalance:"MOCKED 1250.00", // Mocked available balance for quote token
    baseTokenBalance: "MOCKED 15.75", // Mocked base token balance
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Place Order</h3>
      
      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
          <TabsTrigger value="buy" className="data-[state=active]:bg-green-600">Buy</TabsTrigger>
          <TabsTrigger value="sell" className="data-[state=active]:bg-red-600">Sell</TabsTrigger>
        </TabsList>
        
        <TabsContent value="buy" className="space-y-4 mt-4">
          <div>
            <Label className="text-sm text-gray-400">Order Type</Label>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="stop">Stop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {orderType === 'limit' && (
            <div>
              <Label className="text-sm text-gray-400">Price ({quoteToken})</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-gray-800 border-gray-700"
                placeholder="0.00"
              />
            </div>
          )}
          
          <div>
            <Label className="text-sm text-gray-400">Size ({baseToken})</Label>
            <Input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="bg-gray-800 border-gray-700"
              placeholder="0.00"
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>Available: {accountData.quoteTokenBalance} {quoteToken}</span>
          </div>
          
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Place Buy Order
          </Button>
        </TabsContent>
        
        <TabsContent value="sell" className="space-y-4 mt-4">
          <div>
            <Label className="text-sm text-gray-400">Order Type</Label>
            <Select value={orderType} onValueChange={setOrderType}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="limit">Limit</SelectItem>
                <SelectItem value="stop">Stop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {orderType === 'limit' && (
            <div>
              <Label className="text-sm text-gray-400">Price ({quoteToken})</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-gray-800 border-gray-700"
                placeholder="0.00"
              />
            </div>
          )}
          
          <div>
            <Label className="text-sm text-gray-400">Size ({baseToken})</Label>
            <Input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="bg-gray-800 border-gray-700"
              placeholder="0.00"
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>Available: {accountData.baseTokenBalance} {baseToken}</span>
          </div>
          
          <Button className="w-full bg-red-600 hover:bg-red-700">
            Place Sell Order
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrderForm;
