import React from 'react';

interface ScatterPlotProps {
  data: Array<{ x: number; y: number; label?: string }>;
  title?: string;
  color?: string;
  showTrend?: boolean;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ 
  data, 
  title = "Gráfico de Dispersión", 
  color = "#3b82f6",
  showTrend = true
}) => {
  if (data.length === 0) return null;
  
  const maxX = Math.max(...data.map(d => d.x));
  const minX = Math.min(...data.map(d => d.x));
  const rangeX = maxX - minX;
  
  const maxY = Math.max(...data.map(d => d.y));
  const minY = Math.min(...data.map(d => d.y));
  const rangeY = maxY - minY;
  
  // Calcular línea de tendencia (regresión lineal simple)
  const n = data.length;
  const sumX = data.reduce((sum, d) => sum + d.x, 0);
  const sumY = data.reduce((sum, d) => sum + d.y, 0);
  const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
  const sumXX = data.reduce((sum, d) => sum + d.x * d.x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Convertir datos a coordenadas SVG
  const points = data.map(point => ({
    x: rangeX > 0 ? ((point.x - minX) / rangeX * 160) + 20 : 20,
    y: rangeY > 0 ? 180 - ((point.y - minY) / rangeY * 160) : 180,
    original: point
  }));
  
  // Calcular puntos de la línea de tendencia
  const trendPoints = [
    { x: 20, y: 180 - ((intercept + slope * minX - minY) / rangeY * 160) },
    { x: 180, y: 180 - ((intercept + slope * maxX - minY) / rangeY * 160) }
  ];
  
  return (
    <div className="scatter-plot">
      <h4>{title}</h4>
      <div className="scatter-container">
        <svg width="200" height="200" viewBox="0 0 200 200" className="scatter-svg">
          {/* Grid */}
          <g className="grid">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <g key={index}>
                <line
                  x1="20"
                  y1={20 + ratio * 160}
                  x2="180"
                  y2={20 + ratio * 160}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <line
                  x1={20 + ratio * 160}
                  y1="20"
                  x2={20 + ratio * 160}
                  y2="180"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              </g>
            ))}
          </g>
          
          {/* Trend line */}
          {showTrend && (
            <line
              x1={trendPoints[0].x}
              y1={trendPoints[0].y}
              x2={trendPoints[1].x}
              y2={trendPoints[1].y}
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="trend-line"
            />
          )}
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={color}
              stroke="#fff"
              strokeWidth="1"
              className="scatter-point"
              title={`${point.original.x}, ${point.original.y}${point.original.label ? ` - ${point.original.label}` : ''}`}
            />
          ))}
        </svg>
        
        <div className="scatter-legend">
          <div className="legend-item">
            <div 
              className="legend-color"
              style={{ backgroundColor: color }}
            ></div>
            <span>Datos</span>
          </div>
          {showTrend && (
            <div className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: '#ef4444' }}
              ></div>
              <span>Tendencia</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="chart-stats">
        <span>Puntos: {data.length}</span>
        <span>R²: {calculateR2(data, slope, intercept).toFixed(3)}</span>
        <span>Pendiente: {slope.toFixed(3)}</span>
        <span>Intercepto: {intercept.toFixed(3)}</span>
      </div>
    </div>
  );
};

// Función para calcular R²
const calculateR2 = (data: Array<{ x: number; y: number }>, slope: number, intercept: number): number => {
  const n = data.length;
  const meanY = data.reduce((sum, d) => sum + d.y, 0) / n;
  
  const ssRes = data.reduce((sum, d) => {
    const predicted = slope * d.x + intercept;
    return sum + Math.pow(d.y - predicted, 2);
  }, 0);
  
  const ssTot = data.reduce((sum, d) => sum + Math.pow(d.y - meanY, 2), 0);
  
  return 1 - (ssRes / ssTot);
};

export default ScatterPlot;
