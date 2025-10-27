import React from 'react';

interface BarChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title?: string;
  horizontal?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data = [], 
  title = "Gráfico de Barras", 
  horizontal = false 
}) => {
  // Validar que data existe y no está vacío
  if (!data || data.length === 0) {
    return (
      <div className="bar-chart">
        <h4>{title}</h4>
        <div className="chart-empty">
          <p>No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  
  if (horizontal) {
    return (
      <div className="bar-chart horizontal">
        <h4>{title}</h4>
        <div className="horizontal-bars">
          {data.map((item, index) => {
            const width = (item.value / maxValue) * 100;
            const color = item.color || colors[index % colors.length];
            
            return (
              <div key={index} className="horizontal-bar-container">
                <div className="bar-label">{item.label}</div>
                <div className="bar-track">
                  <div 
                    className="horizontal-bar"
                    style={{ 
                      width: `${width}%`,
                      backgroundColor: color
                    }}
                    title={`${item.label}: ${item.value}`}
                  >
                    <span className="bar-value">{item.value}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="chart-stats">
          <span>Total: {data.reduce((sum, item) => sum + item.value, 0)}</span>
          <span>Promedio: {(data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(1)}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bar-chart vertical">
      <h4>{title}</h4>
      <div className="vertical-bars">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          const color = item.color || colors[index % colors.length];
          
          return (
            <div key={index} className="vertical-bar-container">
              <div 
                className="vertical-bar"
                style={{ 
                  height: `${height}%`,
                  backgroundColor: color
                }}
                title={`${item.label}: ${item.value}`}
              >
                <span className="bar-value">{item.value}</span>
              </div>
              <div className="bar-label">{item.label}</div>
            </div>
          );
        })}
      </div>
      <div className="chart-stats">
        <span>Total: {data.reduce((sum, item) => sum + item.value, 0)}</span>
        <span>Promedio: {(data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(1)}</span>
      </div>
    </div>
  );
};

export default BarChart;