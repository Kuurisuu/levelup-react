import React, { useState, useEffect } from 'react';
import PythonCodeBlock from './PythonCodeBlock';
import StatisticalMetrics from './StatisticalMetrics';
import QuartileAnalysis from './QuartileAnalysis';
import MLModelAnalysis from './MLModelAnalysis';
import PythonLibraries from './PythonLibraries';
import PythonCharts from './PythonCharts';
import {
  runCompleteAnalysis,
  generateSampleData,
  pythonImports
} from '../../data/pythonAnalysisSimulation';

interface PythonAnalysisDashboardProps {
  dashboardMetrics?: any;
}

const PythonAnalysisDashboard: React.FC<PythonAnalysisDashboardProps> = ({ dashboardMetrics }) => {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Generar datos de muestra basados en métricas del dashboard
      const sampleData = generateSampleData(dashboardMetrics);
      
      // Ejecutar análisis completo
      const results = await runCompleteAnalysis(sampleData);
      setAnalysisData(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en el análisis');
    } finally {
      setLoading(false);
    }
  };

  // Ejecutar análisis automáticamente cuando cambien las métricas
  useEffect(() => {
    if (dashboardMetrics) {
      runAnalysis();
    }
  }, [dashboardMetrics]);

  const tabs = [
    { id: 'overview', label: '📊 Resumen', icon: '📊' },
    { id: 'statistics', label: '📈 Estadística', icon: '📈' },
    { id: 'quartiles', label: '📦 Quartiles', icon: '📦' },
    { id: 'ml', label: '🤖 ML', icon: '🤖' },
    { id: 'libraries', label: '🐍 Librerías', icon: '🐍' },
    { id: 'code', label: '💻 Código', icon: '💻' }
  ];

  if (loading) {
    return (
      <div className="python-analysis-loading">
        <div className="loading-content">
          <div className="python-spinner">🐍</div>
          <h3>Ejecutando Análisis de Python...</h3>
          <p>Procesando datos con pandas, numpy, matplotlib y scikit-learn</p>
          <div className="loading-steps">
            <div className="step">📊 Generando estadísticas descriptivas...</div>
            <div className="step">📦 Calculando quartiles y outliers...</div>
            <div className="step">🤖 Entrenando modelo de ML...</div>
            <div className="step">📈 Creando visualizaciones...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="python-analysis-error">
        <h3>❌ Error en el Análisis</h3>
        <p>{error}</p>
        <button onClick={runAnalysis} className="btn-retry">
          🔄 Reintentar Análisis
        </button>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="python-analysis-empty">
        <h3>🐍 Python Data Science Dashboard</h3>
        <p>Ejecuta análisis estadísticos y de machine learning con datos del dashboard</p>
        <button onClick={runAnalysis} className="btn-run-analysis">
          ▶️ Ejecutar Análisis Completo
        </button>
      </div>
    );
  }

  return (
    <div className="python-analysis-dashboard">
      <div className="analysis-header">
        <h2>🐍 Python Data Science Analysis</h2>
        <div className="analysis-controls">
          <button onClick={runAnalysis} className="btn-refresh-analysis">
            🔄 Actualizar Análisis
          </button>
          <div className="analysis-info">
            <span>⏱️ Tiempo total: {analysisData.totalExecutionTime}ms</span>
            <span>📊 Datos: {analysisData.dataPoints} puntos</span>
            <span>🕒 {new Date(analysisData.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      <div className="analysis-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="analysis-content">
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <h3>📊 Resumen del Análisis</h3>
            <div className="overview-grid">
              <div className="overview-card">
                <h4>📈 Estadística Descriptiva</h4>
                <div className="card-content">
                  <p>Media: {analysisData.statisticalAnalysis.mean}</p>
                  <p>Desv. Estándar: {analysisData.statisticalAnalysis.std}</p>
                  <p>Asimetría: {analysisData.statisticalAnalysis.skewness}</p>
                </div>
              </div>
              
              <div className="overview-card">
                <h4>📦 Análisis de Quartiles</h4>
                <div className="card-content">
                  <p>Q1: {analysisData.quartileAnalysis.quartiles.q1}</p>
                  <p>Mediana: {analysisData.quartileAnalysis.quartiles.q2}</p>
                  <p>Q3: {analysisData.quartileAnalysis.quartiles.q3}</p>
                  <p>Outliers: {analysisData.quartileAnalysis.outliers.length}</p>
                </div>
              </div>
              
              <div className="overview-card">
                <h4>🤖 Machine Learning</h4>
                <div className="card-content">
                  <p>Modelo: {analysisData.mlAnalysis.name}</p>
                  <p>Accuracy: {(analysisData.mlAnalysis.accuracy * 100).toFixed(1)}%</p>
                  <p>F1-Score: {(analysisData.mlAnalysis.f1Score * 100).toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="overview-card">
                <h4>🐍 Librerías Python</h4>
                <div className="card-content">
                  <p>Matplotlib: {analysisData.matplotlibChart.executionTime}ms</p>
                  <p>Pandas: {analysisData.pandasAnalysis.executionTime}ms</p>
                  <p>NumPy: {analysisData.numpyAnalysis.executionTime}ms</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'statistics' && (
          <StatisticalMetrics metrics={analysisData.statisticalAnalysis} />
        )}

        {activeTab === 'quartiles' && (
          <QuartileAnalysis analysis={analysisData.quartileAnalysis} />
        )}

        {activeTab === 'ml' && (
          <MLModelAnalysis model={analysisData.mlAnalysis} />
        )}

        {activeTab === 'libraries' && (
          <PythonLibraries analyses={[
            analysisData.matplotlibChart,
            analysisData.pandasAnalysis,
            analysisData.numpyAnalysis
          ]} />
        )}

        {activeTab === 'code' && (
          <div className="code-tab">
            <h3>💻 Código Python Generado</h3>
            <PythonCodeBlock
              imports={pythonImports.libraries}
              code="df = pd.DataFrame(data)
stats = df.describe()
plt.figure(figsize=(12, 8))
plt.hist(data, bins=20, alpha=0.7)
plt.title('Distribución de Datos')
plt.show()"
              output={`Análisis completado exitosamente
Datos procesados: ${analysisData.dataPoints} puntos
Tiempo de ejecución: ${analysisData.totalExecutionTime}ms`}
              executionTime={analysisData.totalExecutionTime}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PythonAnalysisDashboard;
