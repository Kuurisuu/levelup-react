import React from 'react';

interface PieChartProps {
  data: Array<{ label: string; value: number; color?: string }>;
  title?: string;
  showPercentage?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ 
  data, 
  title = "Gráfico Circular", 
  showPercentage = true 
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'];
  
  // Calcular ángulos para cada segmento
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle += angle;
    
    return {
      ...item,
      percentage,
      angle,
      startAngle,
      endAngle,
      color: item.color || colors[index % colors.length]
    };
  });
  
  // Generar path para SVG
  const generatePath = (segment: any) => {
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    
    const startAngleRad = (segment.startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (segment.endAngle - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = segment.angle > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };
  
  return (
    <div className="pie-chart">
      <h4>{title}</h4>
      <div className="pie-container">
        <svg width="200" height="200" viewBox="0 0 200 200" className="pie-svg">
          {segments.map((segment, index) => (
            <path
              key={index}
              d={generatePath(segment)}
              fill={segment.color}
              stroke="#fff"
              strokeWidth="2"
              className="pie-segment"
              title={`${segment.label}: ${segment.value} (${segment.percentage.toFixed(1)}%)`}
            />
          ))}
        </svg>
        
        <div className="pie-legend">
          {segments.map((segment, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: segment.color }}
              ></div>
              <div className="legend-text">
                <span className="legend-label">{segment.label}</span>
                <span className="legend-value">
                  {segment.value} {showPercentage && `(${segment.percentage.toFixed(1)}%)`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="chart-stats">
        <span>Total: {total}</span>
        <span>Segmentos: {data.length}</span>
        <span>Mayor: {Math.max(...data.map(d => d.value))}</span>
        <span>Menor: {Math.min(...data.map(d => d.value))}</span>
      </div>
    </div>
  );
};

export default PieChart;
