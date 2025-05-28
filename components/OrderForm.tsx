
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const OrderForm = () => {
  const [orderType, setOrderType] = useState('market');
  const [price, setPrice] = useState('98.47');
  const [size, setSize] = useState('');

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
              <Label className="text-sm text-gray-400">Price (USDC)</Label>
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
            <Label className="text-sm text-gray-400">Size (SOL)</Label>
            <Input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="bg-gray-800 border-gray-700"
              placeholder="0.00"
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>Available: 1,250.00 USDC</span>
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
              <Label className="text-sm text-gray-400">Price (USDC)</Label>
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
            <Label className="text-sm text-gray-400">Size (SOL)</Label>
            <Input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="bg-gray-800 border-gray-700"
              placeholder="0.00"
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-400">
            <span>Available: 15.75 SOL</span>
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
