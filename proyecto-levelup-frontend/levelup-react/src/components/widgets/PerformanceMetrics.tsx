import React from 'react';

interface Metric {
  label: string;
  value: string;
}

interface PerformanceMetricsProps {
  metrics: Metric[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  return (
    <div className="metrics-list">
      {metrics.map((metric, index) => (
        <div key={index} className="metric-item">
          <span className="metric-label">{metric.label}</span>
          <span className="metric-value">{metric.value}</span>
        </div>
      ))}
    </div>
  );
};

export default PerformanceMetrics;
