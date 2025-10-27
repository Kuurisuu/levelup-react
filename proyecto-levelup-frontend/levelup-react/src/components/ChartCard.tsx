import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  chartType: 'bar' | 'line' | 'ranking';
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, chartType }) => {
  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div className="chart-placeholder">
        <div className="chart-mock">
          {children}
          <p>
            {chartType === 'bar' && '📊 Gráfico de barras'}
            {chartType === 'line' && '📈 Gráfico de línea'}
            {chartType === 'ranking' && '🏆 Ranking de productos'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartCard;
