import React from 'react';

interface MetricCategoryProps {
  title: string;
  children: React.ReactNode;
}

const MetricCategory: React.FC<MetricCategoryProps> = ({ title, children }) => {
  return (
    <div className="metric-category">
      <h4>{title}</h4>
      {children}
    </div>
  );
};

export default MetricCategory;
