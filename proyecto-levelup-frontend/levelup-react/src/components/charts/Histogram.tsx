import React from 'react';

interface HistogramProps {
  data: number[];
  bins?: number;
  title?: string;
  color?: string;
}

const Histogram: React.FC<HistogramProps> = ({ 
  data, 
  bins = 20, 
  title = "Histograma", 
  color = "#3b82f6" 
}) => {
  // Calcular histograma
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins;
  
  const histogram = Array(bins).fill(0);
  data.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    histogram[binIndex]++;
  });
  
  const maxCount = Math.max(...histogram);
  
  return (
    <div className="histogram-chart">
      <h4>{title}</h4>
      <div className="histogram-container">
        <div className="histogram-bars">
          {histogram.map((count, index) => {
            const height = (count / maxCount) * 100;
            const binStart = min + index * binWidth;
            const binEnd = min + (index + 1) * binWidth;
            
            return (
              <div key={index} className="histogram-bar-container">
                <div 
                  className="histogram-bar"
                  style={{ 
                    height: `${height}%`,
                    backgroundColor: color,
                    opacity: 0.8
                  }}
                  title={`${binStart.toFixed(0)}-${binEnd.toFixed(0)}: ${count} valores`}
                >
                  {count > 0 && (
                    <span className="bar-count">{count}</span>
                  )}
                </div>
                <div className="bin-label">
                  {binStart.toFixed(0)}
                </div>
              </div>
            );
          })}
        </div>
        <div className="histogram-axis">
          <div className="y-axis">
            <span>{maxCount}</span>
            <span>{Math.floor(maxCount * 0.75)}</span>
            <span>{Math.floor(maxCount * 0.5)}</span>
            <span>{Math.floor(maxCount * 0.25)}</span>
            <span>0</span>
          </div>
        </div>
      </div>
      <div className="histogram-stats">
        <span>Datos: {data.length}</span>
        <span>Bins: {bins}</span>
        <span>Rango: {min.toFixed(0)} - {max.toFixed(0)}</span>
      </div>
    </div>
  );
};

export default Histogram;
