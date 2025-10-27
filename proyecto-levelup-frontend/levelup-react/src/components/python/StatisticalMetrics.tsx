import React from 'react';

interface StatisticalMetricsProps {
  metrics: {
    mean: number;
    median: number;
    mode: number;
    std: number;
    variance: number;
    min: number;
    max: number;
    q1: number;
    q2: number;
    q3: number;
    iqr: number;
    skewness: number;
    kurtosis: number;
    confidenceInterval: [number, number];
  };
}

const StatisticalMetrics: React.FC<StatisticalMetricsProps> = ({ metrics }) => {
  return (
    <div className="statistical-metrics">
      <h3>📊 Estadística Descriptiva</h3>
      
      <div className="metrics-grid">
        <div className="metric-category">
          <h4>Tendencia Central</h4>
          <div className="metric-item">
            <span className="metric-label">Media:</span>
            <span className="metric-value">{metrics.mean}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Mediana:</span>
            <span className="metric-value">{metrics.median}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Moda:</span>
            <span className="metric-value">{metrics.mode}</span>
          </div>
        </div>
        
        <div className="metric-category">
          <h4>Dispersión</h4>
          <div className="metric-item">
            <span className="metric-label">Desv. Estándar:</span>
            <span className="metric-value">{metrics.std}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Varianza:</span>
            <span className="metric-value">{metrics.variance}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Rango:</span>
            <span className="metric-value">{metrics.max - metrics.min}</span>
          </div>
        </div>
        
        <div className="metric-category">
          <h4>Quartiles</h4>
          <div className="metric-item">
            <span className="metric-label">Q1 (25%):</span>
            <span className="metric-value">{metrics.q1}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Q2 (50%):</span>
            <span className="metric-value">{metrics.q2}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Q3 (75%):</span>
            <span className="metric-value">{metrics.q3}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">IQR:</span>
            <span className="metric-value">{metrics.iqr}</span>
          </div>
        </div>
        
        <div className="metric-category">
          <h4>Forma de Distribución</h4>
          <div className="metric-item">
            <span className="metric-label">Asimetría:</span>
            <span className="metric-value">{metrics.skewness}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Curtosis:</span>
            <span className="metric-value">{metrics.kurtosis}</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">IC 95%:</span>
            <span className="metric-value">
              [{metrics.confidenceInterval[0]}, {metrics.confidenceInterval[1]}]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticalMetrics;
