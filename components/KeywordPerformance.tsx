
import React from 'react';
import { PagePerformanceData, KeywordRankInfo } from '../types';
import { Top3Icon, FirstPageIcon } from './icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface KeywordPerformanceProps {
  data: PagePerformanceData[];
}

const KeywordPerformance: React.FC<KeywordPerformanceProps> = ({ data }) => {
  // Hardcode indices for Jan'25 (1) and June'25 (6) as per screenshot
  const janIndex = 1;
  const juneIndex = 6;

  const processKeywordData = (monthIndex: number) => {
    const keywords: KeywordRankInfo[] = [];
    data.forEach(page => {
      page.metrics.forEach(metric => {
        if (metric.isKeyword) {
          const rank = metric.monthlyData[monthIndex];
          if (rank !== null && rank > 0) {
            keywords.push({ keyword: metric.name, url: page.url, rank });
          }
        }
      });
    });
    return keywords;
  };

  const janKeywords = processKeywordData(janIndex);
  const juneKeywords = processKeywordData(juneIndex);

  const top3June = juneKeywords.filter(k => k.rank <= 3);
  const firstPageJune = juneKeywords.filter(k => k.rank <= 10);
  
  const top3JanCount = janKeywords.filter(k => k.rank <= 3).length;
  const firstPageJanCount = janKeywords.filter(k => k.rank <= 10).length;

  const top3ChartData = [
    { name: 'Jan 2025', 'Keywords': top3JanCount },
    { name: 'June 2025', 'Keywords': top3June.length },
  ];

  const firstPageChartData = [
    { name: 'Jan 2025', 'Keywords': firstPageJanCount },
    { name: 'June 2025', 'Keywords': firstPageJune.length },
  ];

  const KeywordListCard: React.FC<{ title: string; keywords: KeywordRankInfo[] }> = ({ title, keywords }) => (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {keywords.length > 0 ? (
        <ul className="space-y-4">
          {keywords.sort((a,b) => a.rank - b.rank).map((item, index) => (
            <li key={index} className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-700">{item.keyword}</p>
                <a href={item.url.startsWith('http') ? item.url : `https://${item.url}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate">
                  {item.url.replace('https://','').replace('www.','')}
                </a>
              </div>
              <div className="flex-shrink-0 ml-4 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 font-bold rounded-full text-sm">
                #{item.rank}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No keywords in this category.</p>
      )}
    </div>
  );

  const StatCard: React.FC<{icon: React.ReactNode, title: string, value: string | number}> = ({icon, title, value}) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        {icon}
        <div>
            <p className="text-gray-500">{title}</p>
            <p className="text-4xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
  );
  
  const TrendChart: React.FC<{title: string, data: any[]}> = ({title, data}) => (
    <div className="bg-white p-6 rounded-xl shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} width={20} />
            <Tooltip
                cursor={{fill: 'rgba(239, 246, 255, 0.5)'}}
                contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #e0e0e0',
                    borderRadius: '0.5rem',
                }}
            />
            <Bar dataKey="Keywords" fill="#3b82f6" barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Keyword Ranking Performance</h2>
      <div className="w-full h-px bg-gray-200 mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <StatCard icon={<Top3Icon/>} title="Keywords in Top 3" value={top3June.length} />
        <StatCard icon={<FirstPageIcon/>} title="First Page Keywords" value={firstPageJune.length} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <TrendChart title="Keywords in Top 3 Positions" data={top3ChartData} />
        <TrendChart title="Keywords on First Page (Top 10)" data={firstPageChartData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <KeywordListCard title="Keywords in Top 3 Positions" keywords={top3June} />
        <KeywordListCard title="First Page Keywords (Top 10)" keywords={firstPageJune} />
      </div>
    </div>
  );
};

export default KeywordPerformance;
