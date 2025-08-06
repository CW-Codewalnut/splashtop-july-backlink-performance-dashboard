
import React from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface SparklineProps {
    data: (number | null)[];
    isKeyword: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({ data, isKeyword }) => {
    const chartData = data
        .map((value, index) => ({ name: index, value }))
        .filter(d => d.value !== null);

    if (chartData.length < 2) {
        return <div className="h-8 w-full flex items-center justify-center text-gray-400 text-xs">N/A</div>;
    }

    const domain = [Math.min(...chartData.map(d => d.value!)), Math.max(...chartData.map(d => d.value!))];
    const color = isKeyword ? '#f59e0b' : '#3b82f6'; // amber-500 for keywords, blue-500 for others

    return (
        <ResponsiveContainer width="100%" height={32}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <YAxis hide domain={domain} />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    connectNulls={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Sparkline;
