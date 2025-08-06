
export interface MetricData {
  name: string;
  monthlyData: (number | null)[];
  lastWeekIncrease: string;
  overallGrowth: string;
  isKeyword?: boolean;
}

export interface PagePerformanceData {
  id: number;
  url: string;
  metrics: MetricData[];
}

export interface KeywordRankInfo {
  keyword: string;
  url: string;
  rank: number;
}

export interface KeywordMove {
  name: string;
  move: number;
}

export interface PerformanceSummaryData {
  url: string;
  paChange: number;
  bestMove: KeywordMove | null;
  worstMove: KeywordMove | null;
  status: 'Improving' | 'Declining' | 'Stable';
}
