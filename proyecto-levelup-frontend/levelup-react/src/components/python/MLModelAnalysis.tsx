import React from 'react';

interface MLModelProps {
  model: {
    name: string;
    type: 'regression' | 'classification' | 'clustering';
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
    features: string[];
    predictions: number[];
  };
}

const MLModelAnalysis: React.FC<MLModelProps> = ({ model }) => {
  const getModelIcon = (type: string) => {
    switch (type) {
      case 'regression': return '📈';
      case 'classification': return '🎯';
      case 'clustering': return '🔍';
      default: return '🤖';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 0.9) return '#10b981'; // Verde
    if (score >= 0.8) return '#f59e0b'; // Amarillo
    if (score >= 0.7) return '#f97316'; // Naranja
    return '#ef4444'; // Rojo
  };

  return (
    <div className="ml-model-analysis">
      <h3>🤖 Machine Learning Analysis</h3>
      
      <div className="model-header">
        <div className="model-info">
          <span className="model-icon">{getModelIcon(model.type)}</span>
          <div className="model-details">
            <h4>{model.name}</h4>
            <span className="model-type">{model.type}</span>
          </div>
        </div>
      </div>
      
      <div className="model-metrics">
        <h4>Métricas de Rendimiento</h4>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">🎯</span>
              <span className="metric-name">Accuracy</span>
            </div>
            <div 
              className="metric-value"
              style={{ color: getPerformanceColor(model.accuracy) }}
            >
              {(model.accuracy * 100).toFixed(1)}%
            </div>
            <div className="metric-bar">
              <div 
                className="metric-fill"
                style={{ 
                  width: `${model.accuracy * 100}%`,
                  backgroundColor: getPerformanceColor(model.accuracy)
                }}
              ></div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">🎪</span>
              <span className="metric-name">Precision</span>
            </div>
            <div 
              className="metric-value"
              style={{ color: getPerformanceColor(model.precision) }}
            >
              {(model.precision * 100).toFixed(1)}%
            </div>
            <div className="metric-bar">
              <div 
                className="metric-fill"
                style={{ 
                  width: `${model.precision * 100}%`,
                  backgroundColor: getPerformanceColor(model.precision)
                }}
              ></div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">📊</span>
              <span className="metric-name">Recall</span>
            </div>
            <div 
              className="metric-value"
              style={{ color: getPerformanceColor(model.recall) }}
            >
              {(model.recall * 100).toFixed(1)}%
            </div>
            <div className="metric-bar">
              <div 
                className="metric-fill"
                style={{ 
                  width: `${model.recall * 100}%`,
                  backgroundColor: getPerformanceColor(model.recall)
                }}
              ></div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-icon">⚖️</span>
              <span className="metric-name">F1-Score</span>
            </div>
            <div 
              className="metric-value"
              style={{ color: getPerformanceColor(model.f1Score) }}
            >
              {(model.f1Score * 100).toFixed(1)}%
            </div>
            <div className="metric-bar">
              <div 
                className="metric-fill"
                style={{ 
                  width: `${model.f1Score * 100}%`,
                  backgroundColor: getPerformanceColor(model.f1Score)
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="model-features">
        <h4>Features Utilizadas</h4>
        <div className="features-list">
          {model.features.map((feature, index) => (
            <span key={index} className="feature-tag">
              {feature}
            </span>
          ))}
        </div>
      </div>
      
      <div className="model-predictions">
        <h4>Predicciones Generadas</h4>
        <div className="predictions-preview">
          <div className="predictions-stats">
            <span>Total predicciones: {model.predictions.length}</span>
            <span>Promedio: {model.predictions.reduce((a, b) => a + b, 0) / model.predictions.length}</span>
            <span>Min: {Math.min(...model.predictions)}</span>
            <span>Max: {Math.max(...model.predictions)}</span>
          </div>
          <div className="predictions-sample">
            <span>Muestra: </span>
            {model.predictions.slice(0, 5).map((pred, index) => (
              <span key={index} className="prediction-value">
                {pred.toFixed(2)}
              </span>
            ))}
            {model.predictions.length > 5 && (
              <span className="more-predictions">
                ... +{model.predictions.length - 5} más
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLModelAnalysis;
