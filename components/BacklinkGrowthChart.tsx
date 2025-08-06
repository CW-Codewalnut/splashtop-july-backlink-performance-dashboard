
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';

interface ChartData {
  name: string;
  'Total Backlinks': number;
}

interface BacklinkGrowthChartProps {
  data: ChartData[];
}

const BacklinkGrowthChart: React.FC<BacklinkGrowthChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-lg mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Backlink Growth Analysis (All URLs)</h2>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: 30,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis 
                stroke="#6b7280"
                label={{ value: 'Total Backlinks', angle: -90, position: 'insideLeft', offset: -20, style: { textAnchor: 'middle', fill: '#6b7280' } }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(5px)',
                border: '1px solid #e0e0e0',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
              cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '3 3' }}
            />
            <Legend verticalAlign="bottom" />
            <Line
              type="monotone"
              dataKey="Total Backlinks"
              stroke="#3b82f6"
              strokeWidth={3}
              activeDot={{ r: 8, stroke: '#3b82f6', fill: '#fff', strokeWidth: 2 }}
              dot={{ r: 5, stroke: '#fff', strokeWidth: 2, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BacklinkGrowthChart;
