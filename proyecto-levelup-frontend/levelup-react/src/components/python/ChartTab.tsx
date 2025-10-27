import React from 'react';

interface ChartTabProps {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ id, label, icon, isActive, onClick }) => {
  return (
    <button
      className={`chart-tab ${isActive ? 'active' : ''}`}
      onClick={() => onClick(id)}
    >
      <span className="tab-icon">{icon}</span>
      <span className="tab-label">{label}</span>
    </button>
  );
};

export default ChartTab;
