
import React from 'react';
import Header from './components/Header';
import SummaryCard from './components/SummaryCard';
import { performanceData, months } from './data';
import { UrlIcon, LinkIcon, KeywordIcon } from './components/icons';
import BacklinkGrowthChart from './components/BacklinkGrowthChart';
import KeywordPerformance from './components/KeywordPerformance';
import PerformanceSummaryTable from './components/PerformanceSummaryTable';

const App: React.FC = () => {
  const totalBacklinks = performanceData
    .flatMap(p => p.metrics.find(m => m.name === 'Total Backlinks')?.monthlyData.slice(-1)[0] || 0)
    .reduce((sum, current) => sum + (current || 0), 0);

  const totalKeywords = performanceData
    .flatMap(p => p.metrics.filter(m => m.isKeyword).length)
    .reduce((sum, current) => sum + current, 0);

  // Calculate data for the backlink growth chart
  const chartMonths = months.slice(1); // Exclude Dec'24 as it has no backlink data

  const backlinkChartData = chartMonths.map((month, monthIndex) => {
    const totalForMonth = performanceData.reduce((sum, page) => {
      const backlinkMetric = page.metrics.find(m => m.name === 'Total Backlinks');
      if (backlinkMetric) {
        // monthIndex is 0 for Jan'25, but data is at index 1 in the full monthlyData array
        const value = backlinkMetric.monthlyData[monthIndex + 1];
        return sum + (value || 0);
      }
      return sum;
    }, 0);

    return {
      name: month.split("'")[0], // e.g., 'Jan' from 'Jan'25'
      'Total Backlinks': totalForMonth,
    };
  });
  
  // Filter out initial months with no data to not have a flat line at 0 at the start
  const firstDataPointIndex = backlinkChartData.findIndex(d => d['Total Backlinks'] > 0);
  const finalChartData = firstDataPointIndex > -1 ? backlinkChartData.slice(firstDataPointIndex) : [];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            icon={<i className="fa-solid fa-file-lines text-3xl text-blue-500"></i>}
            title="Source" 
            value="GA, moz, GSC" 
            description="Data sources"
          />
          <SummaryCard 
            icon={<UrlIcon />} 
            title="URLs Tracked" 
            value={performanceData.length.toString()} 
            description="Total pages monitored"
          />
          <SummaryCard 
            icon={<LinkIcon />}
            title="Total Backlinks" 
            value={totalBacklinks.toLocaleString()} 
            description="Latest count across all pages"
          />
          <SummaryCard 
            icon={<KeywordIcon />}
            title="Keywords Tracked" 
            value={totalKeywords.toString()} 
            description="Total keywords monitored"
          />
        </div>

        <BacklinkGrowthChart data={finalChartData} />

        <KeywordPerformance data={performanceData} />

        <PerformanceSummaryTable data={performanceData} />
        
      </main>
    </div>
  );
};

export default App;
