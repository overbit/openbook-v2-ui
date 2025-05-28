
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Loader } from 'lucide-react';

interface ChartDataPoint {
  time: string;
  price: number;
}

interface TradingChartProps {
  market: string;
  data?: ChartDataPoint[];
  isLoading: boolean;
}

const TradingChart: React.FC<TradingChartProps> = ({ market, data = [], isLoading }) => {
  const [timeframe, setTimeframe] = useState('1D');
  
  // If no data is provided, use an empty array
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{market} Chart</h3>
        <div className="flex space-x-2">
          {['1H', '4H', '1D', '1W', '1M'].map((tf) => (
            <button
              key={tf}
              className={`px-2 py-1 text-xs ${timeframe === tf ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'} rounded`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[calc(100%-60px)]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin h-8 w-8 mr-2" />
            <span>Loading chart data...</span>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  borderColor: '#4B5563',
                  color: '#F9FAFB'
                }}
                itemStyle={{ color: '#10B981' }}
                formatter={(value) => [`$${value}`, 'Price']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>No chart data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingChart;
