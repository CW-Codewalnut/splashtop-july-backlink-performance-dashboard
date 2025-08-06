
import React, { useState } from 'react';
import { PagePerformanceData, MetricData } from '../types';
import Sparkline from './Sparkline';
import { ChevronDownIcon } from './icons';

interface PerformanceTableProps {
  data: PagePerformanceData[];
  months: string[];
}

const GrowthIndicator: React.FC<{ value: string }> = ({ value }) => {
    if (!value || value.includes('#')) {
        return <span className="text-gray-400">-</span>;
    }
    const isNegative = value.startsWith('-');
    const color = isNegative ? 'text-red-500' : 'text-green-500';
    return <span className={`${color} font-semibold`}>{value}</span>;
};


const PerformanceTableRow: React.FC<{ page: PagePerformanceData, months: string[] }> = ({ page, months }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <>
            <tr className="bg-white hover:bg-gray-50 border-t border-b">
                <td className="p-3 text-center">{page.id}</td>
                <td className="p-3 font-medium text-blue-600">
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 w-full text-left">
                        <ChevronDownIcon className={isOpen ? 'rotate-180' : ''}/>
                        <span>{page.url}</span>
                    </button>
                </td>
                <td colSpan={months.length + 4}></td>
            </tr>
            {isOpen && page.metrics.map((metric, index) => (
                <tr key={index} className="bg-white text-sm">
                    <td className="p-2 border-l border-gray-200"></td>
                    <td className={`p-2 text-gray-600 ${metric.isKeyword ? 'pl-10' : 'font-semibold'}`}>{metric.name}</td>
                    {metric.monthlyData.map((val, i) => (
                        <td key={i} className={`p-2 text-center ${getCellColor(val, metric.monthlyData, metric.isKeyword)}`}>
                            {val ?? '-'}
                        </td>
                    ))}
                    <td className="p-2 text-center">
                        <GrowthIndicator value={metric.lastWeekIncrease} />
                    </td>
                    <td className="p-2 text-center">
                         <GrowthIndicator value={metric.overallGrowth} />
                    </td>
                    <td className="p-2 w-32 align-middle">
                        <Sparkline data={metric.monthlyData} isKeyword={!!metric.isKeyword} />
                    </td>
                </tr>
            ))}
        </>
    )
}

const getCellColor = (value: number | null, data: (number | null)[], isKeyword?: boolean) => {
    if (value === null) return 'text-gray-400';
    if (!isKeyword) return 'text-gray-700';
    
    const validData = data.filter(v => v !== null) as number[];
    if (validData.length < 2) return 'text-gray-700';

    const min = Math.min(...validData);
    const max = Math.max(...validData);
    if (max === min) return 'text-gray-700';

    const ratio = (value - min) / (max - min);

    if (ratio < 0.33) return 'bg-yellow-100 text-yellow-800';
    if (ratio > 0.66) return 'bg-green-100 text-green-800';
    return 'bg-yellow-50 text-yellow-700';
}


const PerformanceTable: React.FC<PerformanceTableProps> = ({ data, months }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-white uppercase bg-blue-800">
          <tr>
            <th scope="col" className="p-3 w-12 text-center">Sl.no</th>
            <th scope="col" className="p-3">Page URL & Avg Engagement Time on page</th>
            {months.slice(1).map(month => (
              <th key={month} scope="col" className="p-3 text-center">{month}</th>
            ))}
             <th scope="col" className="p-3 text-center">% increased from to Last week</th>
             <th scope="col" className="p-3 text-center">% Over all Growth</th>
             <th scope="col" className="p-3 text-center">Sparkline</th>
          </tr>
        </thead>
        <tbody>
            {data.map((page) => (
                <PerformanceTableRow key={page.id} page={page} months={months} />
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceTable;
