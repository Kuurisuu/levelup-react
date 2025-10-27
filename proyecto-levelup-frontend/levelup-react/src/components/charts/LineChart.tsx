import React from 'react';

interface LineChartProps {
  data: Array<{ x: number | string; y: number }>;
  title?: string;
  color?: string;
  showPoints?: boolean;
  showGrid?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  title = "Gráfico de Líneas", 
  color = "#3b82f6",
  showPoints = true,
  showGrid = true
}) => {
  if (data.length === 0) return null;
  
  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const rangeY = maxY - minY;
  
  const maxX = Math.max(...data.map(d => typeof d.x === 'number' ? d.x : 0));
  const minX = Math.min(...data.map(d => typeof d.x === 'number' ? d.x : 0));
  const rangeX = maxX - minX;
  
  // Convertir datos a coordenadas SVG
  const points = data.map((point, index) => {
    const x = rangeX > 0 ? ((typeof point.x === 'number' ? point.x : index) - minX) / rangeX * 180 + 10 : 10 + (index * 180 / data.length);
    const y = rangeY > 0 ? 190 - ((point.y - minY) / rangeY * 160) : 190 - (index * 160 / data.length);
    return { x, y, original: point };
  });
  
  // Generar path para la línea
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  return (
    <div className="line-chart">
      <h4>{title}</h4>
      <div className="line-container">
        <svg width="200" height="200" viewBox="0 0 200 200" className="line-svg">
          {/* Grid lines */}
          {showGrid && (
            <g className="grid">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
                <g key={index}>
                  <line
                    x1="10"
                    y1={10 + ratio * 160}
                    x2="190"
                    y2={10 + ratio * 160}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                  <text
                    x="5"
                    y={10 + ratio * 160 + 3}
                    fontSize="8"
                    fill="#6b7280"
                    textAnchor="end"
                  >
                    {Math.round(minY + (1 - ratio) * rangeY)}
                  </text>
                </g>
              ))}
            </g>
          )}
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="2"
            className="line-path"
          />
          
          {/* Points */}
          {showPoints && points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              fill={color}
              stroke="#fff"
              strokeWidth="1"
              className="line-point"
              title={`${point.original.x}: ${point.original.y}`}
            />
          ))}
        </svg>
        
        <div className="line-legend">
          <div className="legend-item">
            <div 
              className="legend-color"
              style={{ backgroundColor: color }}
            ></div>
            <span>Serie de Datos</span>
          </div>
        </div>
      </div>
      
      <div className="chart-stats">
        <span>Puntos: {data.length}</span>
        <span>Máximo: {maxY}</span>
        <span>Mínimo: {minY}</span>
        <span>Rango: {rangeY.toFixed(1)}</span>
      </div>
    </div>
  );
};

export default LineChart;