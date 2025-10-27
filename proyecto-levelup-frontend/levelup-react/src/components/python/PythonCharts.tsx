import React, { useState, useEffect } from 'react';
import Histogram from './Histogram';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import ScatterPlot from './ScatterPlot';
import { generateSampleData } from '../../data/pythonAnalysisSimulation';

interface PythonChartsProps {
  dashboardMetrics?: any;
}

const PythonCharts: React.FC<PythonChartsProps> = ({ dashboardMetrics }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeChart, setActiveChart] = useState('histogram');

  const generateChartData = async () => {
    setLoading(true);
    
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const sampleData = generateSampleData(dashboardMetrics);
    
    // Generar datos para diferentes tipos de gráficos
    const data = {
      histogram: sampleData,
      barChart: [
        { label: 'Enero', value: Math.floor(Math.random() * 1000) + 500 },
        { label: 'Febrero', value: Math.floor(Math.random() * 1000) + 500 },
        { label: 'Marzo', value: Math.floor(Math.random() * 1000) + 500 },
        { label: 'Abril', value: Math.floor(Math.random() * 1000) + 500 },
        { label: 'Mayo', value: Math.floor(Math.random() * 1000) + 500 },
        { label: 'Junio', value: Math.floor(Math.random() * 1000) + 500 }
      ],
      pieChart: [
        { label: 'Ventas Online', value: Math.floor(Math.random() * 1000) + 500 },
        { label: 'Ventas Tienda', value: Math.floor(Math.random() * 1000) + 500 },
        { label: 'Ventas Mayorista', value: Math.floor(Math.random() * 1000) + 500 },
        { label: 'Ventas Corporativas', value: Math.floor(Math.random() * 1000) + 500 }
      ],
      lineChart: sampleData.slice(0, 30).map((value, index) => ({
        x: index + 1,
        y: value
      })),
      scatterPlot: sampleData.slice(0, 50).map((value, index) => ({
        x: index + Math.random() * 10,
        y: value + Math.random() * 1000 - 500
      }))
    };
    
    setChartData(data);
    setLoading(false);
  };

  useEffect(() => {
    if (dashboardMetrics) {
      generateChartData();
    }
  }, [dashboardMetrics]);

  const charts = [
    { id: 'histogram', label: '📊 Histograma', icon: '📊' },
    { id: 'barChart', label: '📈 Barras', icon: '📈' },
    { id: 'pieChart', label: '🥧 Circular', icon: '🥧' },
    { id: 'lineChart', label: '📉 Líneas', icon: '📉' },
    { id: 'scatterPlot', label: '🔍 Dispersión', icon: '🔍' }
  ];

  if (loading) {
    return (
      <div className="python-charts-loading">
        <div className="loading-content">
          <div className="chart-spinner">📊</div>
          <h3>Generando Gráficos...</h3>
          <p>Procesando datos con matplotlib y seaborn</p>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="python-charts-empty">
        <h3>📊 Visualizaciones de Python</h3>
        <p>Genera gráficos interactivos con datos del dashboard</p>
        <button onClick={generateChartData} className="btn-generate-charts">
          ▶️ Generar Gráficos
        </button>
      </div>
    );
  }

  const renderChart = () => {
    switch (activeChart) {
      case 'histogram':
        return (
          <Histogram 
            data={chartData.histogram} 
            title="Distribución de Ventas"
            color="#3b82f6"
          />
        );
      case 'barChart':
        return (
          <BarChart 
            data={chartData.barChart} 
            title="Ventas por Mes"
            horizontal={false}
          />
        );
      case 'pieChart':
        return (
          <PieChart 
            data={chartData.pieChart} 
            title="Distribución de Canales"
            showPercentage={true}
          />
        );
      case 'lineChart':
        return (
          <LineChart 
            data={chartData.lineChart} 
            title="Tendencia de Ventas"
            color="#10b981"
            showPoints={true}
            showGrid={true}
          />
        );
      case 'scatterPlot':
        return (
          <ScatterPlot 
            data={chartData.scatterPlot} 
            title="Correlación de Datos"
            color="#f59e0b"
            showTrend={true}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="python-charts">
      <div className="charts-header">
        <h3>📊 Visualizaciones con Python</h3>
        <div className="charts-controls">
          <button onClick={generateChartData} className="btn-refresh-charts">
            🔄 Actualizar Datos
          </button>
        </div>
      </div>

      <div className="charts-tabs">
        {charts.map(chart => (
          <button
            key={chart.id}
            className={`chart-tab ${activeChart === chart.id ? 'active' : ''}`}
            onClick={() => setActiveChart(chart.id)}
          >
            <span className="tab-icon">{chart.icon}</span>
            <span className="tab-label">{chart.label}</span>
          </button>
        ))}
      </div>

      <div className="chart-container">
        {renderChart()}
      </div>

      <div className="charts-info">
        <div className="info-section">
          <h4>📋 Información del Gráfico</h4>
          <div className="info-grid">
            <div className="info-item">
              <span>Tipo:</span>
              <span>{charts.find(c => c.id === activeChart)?.label}</span>
            </div>
            <div className="info-item">
              <span>Datos:</span>
              <span>{chartData[activeChart]?.length || 0} puntos</span>
            </div>
            <div className="info-item">
              <span>Librería:</span>
              <span>matplotlib/seaborn</span>
            </div>
            <div className="info-item">
              <span>Actualizado:</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        
        <div className="code-section">
          <h4>💻 Código Python</h4>
          <div className="python-code">
            <pre>
{`import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Datos del gráfico
data = ${JSON.stringify(chartData[activeChart], null, 2)}

# Crear gráfico
plt.figure(figsize=(10, 6))
${getPythonCode(activeChart)}
plt.title('${charts.find(c => c.id === activeChart)?.label}')
plt.show()`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const getPythonCode = (chartType: string): string => {
  switch (chartType) {
    case 'histogram':
      return `plt.hist(data, bins=20, alpha=0.7, color='skyblue')
plt.xlabel('Valores')
plt.ylabel('Frecuencia')`;
    case 'barChart':
      return `labels = [item['label'] for item in data]
values = [item['value'] for item in data]
plt.bar(labels, values, color='steelblue')
plt.xlabel('Categorías')
plt.ylabel('Valores')`;
    case 'pieChart':
      return `labels = [item['label'] for item in data]
values = [item['value'] for item in data]
plt.pie(values, labels=labels, autopct='%1.1f%%')
plt.axis('equal')`;
    case 'lineChart':
      return `x = [point['x'] for point in data]
y = [point['y'] for point in data]
plt.plot(x, y, marker='o', linewidth=2)
plt.xlabel('X')
plt.ylabel('Y')`;
    case 'scatterPlot':
      return `x = [point['x'] for point in data]
y = [point['y'] for point in data]
plt.scatter(x, y, alpha=0.6)
plt.xlabel('X')
plt.ylabel('Y')`;
    default:
      return '';
  }
};

export default PythonCharts;
