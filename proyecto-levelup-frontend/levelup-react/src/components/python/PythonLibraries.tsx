import React from 'react';

interface PythonLibrariesProps {
  analyses: Array<{
    library: string;
    version: string;
    function: string;
    parameters: Record<string, any>;
    result: any;
    executionTime: number;
  }>;
}

const PythonLibraries: React.FC<PythonLibrariesProps> = ({ analyses }) => {
  const getLibraryIcon = (library: string) => {
    switch (library.toLowerCase()) {
      case 'matplotlib': return '📊';
      case 'seaborn': return '🎨';
      case 'pandas': return '🐼';
      case 'numpy': return '🔢';
      case 'sklearn': return '🤖';
      case 'scipy': return '🔬';
      default: return '🐍';
    }
  };

  const getLibraryColor = (library: string) => {
    switch (library.toLowerCase()) {
      case 'matplotlib': return '#11557c';
      case 'seaborn': return '#4a90e2';
      case 'pandas': return '#e70488';
      case 'numpy': return '#4dabcf';
      case 'sklearn': return '#f7931e';
      case 'scipy': return '#8c1515';
      default: return '#3776ab';
    }
  };

  return (
    <div className="python-libraries">
      <h3>🐍 Análisis con Librerías de Python</h3>
      
      <div className="libraries-grid">
        {analyses.map((analysis, index) => (
          <div key={index} className="library-card">
            <div 
              className="library-header"
              style={{ backgroundColor: getLibraryColor(analysis.library) }}
            >
              <span className="library-icon">{getLibraryIcon(analysis.library)}</span>
              <div className="library-info">
                <h4>{analysis.library}</h4>
                <span className="library-version">v{analysis.version}</span>
              </div>
              <span className="execution-time">
                ⏱️ {analysis.executionTime}ms
              </span>
            </div>
            
            <div className="library-content">
              <div className="function-info">
                <span className="function-label">Función:</span>
                <code className="function-name">{analysis.function}</code>
              </div>
              
              <div className="parameters-section">
                <span className="parameters-label">Parámetros:</span>
                <div className="parameters-list">
                  {Object.entries(analysis.parameters).map(([key, value]) => (
                    <div key={key} className="parameter-item">
                      <span className="parameter-key">{key}:</span>
                      <span className="parameter-value">
                        {typeof value === 'string' ? `"${value}"` : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="result-section">
                <span className="result-label">Resultado:</span>
                <div className="result-content">
                  {Object.entries(analysis.result).map(([key, value]) => (
                    <div key={key} className="result-item">
                      <span className="result-key">{key}:</span>
                      <span className="result-value">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="libraries-summary">
        <h4>Resumen de Ejecución</h4>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Librerías utilizadas:</span>
            <span className="summary-value">{analyses.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Tiempo total:</span>
            <span className="summary-value">
              {analyses.reduce((sum, analysis) => sum + analysis.executionTime, 0).toFixed(0)}ms
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Promedio por librería:</span>
            <span className="summary-value">
              {(analyses.reduce((sum, analysis) => sum + analysis.executionTime, 0) / analyses.length).toFixed(0)}ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonLibraries;
