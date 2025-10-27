export type ReportType = 
  | 'quartiles'
  | 'correlations'
  | 'ml'
  | 'timeseries'
  | 'distributions'
  | 'clustering';

export interface ReportData {
  title: string;
  description: string;
  libraries: string[];
  charts: string[];
  metrics: string[];
}
