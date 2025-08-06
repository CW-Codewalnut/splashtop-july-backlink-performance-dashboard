
import React, { useMemo } from 'react';
import { PagePerformanceData, PerformanceSummaryData } from '../types';
import { ImprovingIcon } from './icons';

interface PerformanceSummaryTableProps {
  data: PagePerformanceData[];
}

const getFirstValid = (arr: (number | null)[]) => arr.find(v => v !== null) ?? null;
const getLastValid = (arr: (number | null)[]) => [...arr].reverse().find(v => v !== null) ?? null;

const PerformanceSummaryTable: React.FC<PerformanceSummaryTableProps> = ({ data }) => {
  const summaryData: PerformanceSummaryData[] = useMemo(() => {
    return data.map(page => {
      // 1. Calculate Page Authority Change
      const paMetric = page.metrics.find(m => m.name === 'Page Authority');
      let paChange = 0;
      if (paMetric) {
        const firstPA = getFirstValid(paMetric.monthlyData);
        const lastPA = getLastValid(paMetric.monthlyData);
        if (firstPA !== null && lastPA !== null) {
          paChange = lastPA - firstPA;
        }
      }

      // 2. Calculate Keyword Moves
      const keywordMetrics = page.metrics.filter(m => m.isKeyword);
      const moves = keywordMetrics.map(kw => {
        const firstRank = getFirstValid(kw.monthlyData);
        const lastRank = getLastValid(kw.monthlyData);
        let move = 0;
        if (firstRank !== null && lastRank !== null) {
          move = firstRank - lastRank; // Positive change is an improvement (e.g., rank 50 -> 10 is a +40 move)
        }
        return { name: kw.name, move };
      });

      const positiveMoves = moves.filter(m => m.move > 0);
      const negativeMoves = moves.filter(m => m.move < 0);

      const bestMove = positiveMoves.length > 0
        ? positiveMoves.reduce((max, current) => current.move > max.move ? current : max)
        : null;
      
      const worstMove = negativeMoves.length > 0
        ? negativeMoves.reduce((min, current) => current.move < min.move ? current : min)
        : null;

      // 3. Determine Overall Status
      const totalKeywordMove = moves.reduce((sum, m) => sum + m.move, 0);
      let status: PerformanceSummaryData['status'] = 'Stable';
      if (paChange > 0 || totalKeywordMove > 0) {
        status = 'Improving';
      } else if (paChange < 0 && totalKeywordMove <= 0) {
        status = 'Declining';
      }

      return { url: page.url, paChange, bestMove, worstMove, status };
    });
  }, [data]);

  const MoveDisplay: React.FC<{ move: { name: string, move: number } | null, type: 'best' | 'worst' }> = ({ move, type }) => {
    if (!move) {
      return <span className="text-gray-500">N/A</span>;
    }
    const color = type === 'best' ? 'text-green-600' : 'text-red-600';
    const sign = move.move > 0 ? '+' : '';
    return <span className={color}>{move.name} ({sign}{move.move})</span>
  };

  return (
    <div className="my-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Performance Summary</h2>
      <div className="w-full h-px bg-gray-200 mb-6"></div>
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">URL</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">PA Change</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Best Keyword Move</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Worst Keyword Move</th>
                <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Overall Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {summaryData.map((summary, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 whitespace-nowrap font-medium text-gray-800">
                    {summary.url.replace('https://www.','').replace('www.','')}
                    </td>
                  <td className="p-4 whitespace-nowrap text-gray-600 font-semibold">
                    {summary.paChange > 0 ? `+${summary.paChange}` : summary.paChange}
                  </td>
                  <td className="p-4 whitespace-nowrap font-semibold">
                    <MoveDisplay move={summary.bestMove} type="best" />
                  </td>
                  <td className="p-4 whitespace-nowrap font-semibold">
                    <MoveDisplay move={summary.worstMove} type="worst" />
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {summary.status === 'Improving' && (
                      <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <ImprovingIcon />
                        Improving
                      </span>
                    )}
                     {summary.status !== 'Improving' && (
                         <span className="text-gray-600">{summary.status}</span>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummaryTable;
