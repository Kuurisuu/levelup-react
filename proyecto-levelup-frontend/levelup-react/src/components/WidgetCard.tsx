import React from 'react';

interface WidgetCardProps {
  title: string;
  children: React.ReactNode;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ title, children }) => {
  return (
    <div className="widget-card">
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default WidgetCard;
