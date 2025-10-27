import React from 'react';

interface QuartileAnalysisProps {
  analysis: {
    quartiles: {
      q0: number;
      q1: number;
      q2: number;
      q3: number;
      q4: number;
    };
    outliers: number[];
    boxPlotData: {
      lowerWhisker: number;
      upperWhisker: number;
      outliers: number[];
    };
  };
}

const QuartileAnalysis: React.FC<QuartileAnalysisProps> = ({ analysis }) => {
  const { quartiles, outliers, boxPlotData } = analysis;
  
  // Calcular posiciones para el box plot visual
  const totalRange = quartiles.q4 - quartiles.q0;
  const q1Pos = ((quartiles.q1 - quartiles.q0) / totalRange) * 100;
  const q2Pos = ((quartiles.q2 - quartiles.q0) / totalRange) * 100;
  const q3Pos = ((quartiles.q3 - quartiles.q0) / totalRange) * 100;
  const lowerWhiskerPos = ((boxPlotData.lowerWhisker - quartiles.q0) / totalRange) * 100;
  const upperWhiskerPos = ((boxPlotData.upperWhisker - quartiles.q0) / totalRange) * 100;
  
  return (
    <div className="quartile-analysis">
      <h3>📦 Análisis de Quartiles</h3>
      
      <div className="analysis-content">
        <div className="box-plot-visual">
          <h4>Box Plot Visual</h4>
          <div className="box-plot-container">
            <div className="box-plot-axis">
              <div className="axis-label">Valores</div>
              <div className="axis-line"></div>
              
              {/* Lower Whisker */}
              <div 
                className="whisker lower"
                style={{ left: `${lowerWhiskerPos}%` }}
              ></div>
              
              {/* Box */}
              <div 
                className="box"
                style={{ 
                  left: `${q1Pos}%`, 
                  width: `${q3Pos - q1Pos}%` 
                }}
              >
                <div className="median-line"></div>
              </div>
              
              {/* Upper Whisker */}
              <div 
                className="whisker upper"
                style={{ left: `${upperWhiskerPos}%` }}
              ></div>
              
              {/* Outliers */}
              {outliers.map((outlier, index) => {
                const outlierPos = ((outlier - quartiles.q0) / totalRange) * 100;
                return (
                  <div 
                    key={index}
                    className="outlier"
                    style={{ left: `${outlierPos}%` }}
                    title={`Outlier: ${outlier}`}
                  ></div>
                );
              })}
            </div>
            
            <div className="box-plot-labels">
              <span style={{ left: `${lowerWhiskerPos}%` }}>
                {boxPlotData.lowerWhisker}
              </span>
              <span style={{ left: `${q1Pos}%` }}>
                Q1: {quartiles.q1}
              </span>
              <span style={{ left: `${q2Pos}%` }}>
                Q2: {quartiles.q2}
              </span>
              <span style={{ left: `${q3Pos}%` }}>
                Q3: {quartiles.q3}
              </span>
              <span style={{ left: `${upperWhiskerPos}%` }}>
                {boxPlotData.upperWhisker}
              </span>
            </div>
          </div>
        </div>
        
        <div className="quartile-stats">
          <h4>Estadísticas de Quartiles</h4>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Mínimo (Q0):</span>
              <span className="stat-value">{quartiles.q0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Primer Quartil (Q1):</span>
              <span className="stat-value">{quartiles.q1}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Mediana (Q2):</span>
              <span className="stat-value">{quartiles.q2}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tercer Quartil (Q3):</span>
              <span className="stat-value">{quartiles.q3}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Máximo (Q4):</span>
              <span className="stat-value">{quartiles.q4}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rango Intercuartílico:</span>
              <span className="stat-value">{quartiles.q3 - quartiles.q1}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Outliers Detectados:</span>
              <span className="stat-value">{outliers.length}</span>
            </div>
          </div>
          
          {outliers.length > 0 && (
            <div className="outliers-list">
              <h5>Valores Atípicos:</h5>
              <div className="outliers-container">
                {outliers.slice(0, 10).map((outlier, index) => (
                  <span key={index} className="outlier-tag">
                    {outlier}
                  </span>
                ))}
                {outliers.length > 10 && (
                  <span className="more-outliers">
                    +{outliers.length - 10} más...
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuartileAnalysis;
