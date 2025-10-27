import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, changeType, icon }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-icon">
        <i className={icon}></i>
      </div>
      <div className="kpi-content">
        <h3>{title}</h3>
        <div className="kpi-value">{value}</div>
        <div className={`kpi-change ${changeType}`}>{change}</div>
      </div>
    </div>
  );
};

export default KPICard;
