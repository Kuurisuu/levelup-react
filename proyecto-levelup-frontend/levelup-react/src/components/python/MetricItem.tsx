import React from 'react';

interface MetricItemProps {
  label: string;
  value: number | string;
  color?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ label, value, color = '#10b981' }) => {
  return (
    <div className="metric-item">
      <span className="metric-label">{label}:</span>
      <span className="metric-value" style={{ color }}>
        {value}
      </span>
    </div>
  );
};

export default MetricItem;
