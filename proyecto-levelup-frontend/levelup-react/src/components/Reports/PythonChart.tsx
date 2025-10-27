import React, { useState, useEffect } from 'react';
import { ReportType } from '../../types/reports';

interface PythonChartProps {
  reportType: ReportType;
  isVisible: boolean;
  onClose: () => void;
}

const PythonChart: React.FC<PythonChartProps> = ({ reportType, isVisible, onClose }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      generateChartData();
    }
  }, [isVisible, reportType]);

  const generateChartData = async () => {
    setIsLoading(true);
    
    // Simular tiempo de procesamiento de Python
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generar datos simulados para cada tipo de gráfica
    const data = generateSimulatedData(reportType);
    setChartData(data);
    setIsLoading(false);
  };

  const generateSimulatedData = (type: ReportType) => {
    switch (type) {
      case 'quartiles':
        return {
          title: 'Distribución de Precios por Categoría',
          type: 'boxplot',
          data: {
            categories: ['Consolas', 'Periféricos', 'Polerones', 'Entretenimiento'],
            values: [
              [45000, 55000, 65000, 75000, 85000], // Consolas
              [15000, 25000, 35000, 45000, 55000], // Periféricos
              [8000, 12000, 18000, 25000, 35000],  // Polerones
              [5000, 8000, 12000, 18000, 25000]   // Entretenimiento
            ],
            description: 'Análisis de distribución de precios por categoría de productos'
          }
        };
      
      case 'correlations':
        return {
          title: 'Correlaciones entre Métricas de Ecommerce',
          type: 'heatmap',
          data: {
            labels: ['Precio', 'Ventas', 'Stock', 'Rating', 'Descuento', 'Visitas'],
            matrix: [
              [1.0, 0.65, -0.23, 0.45, -0.78, 0.32],
              [0.65, 1.0, -0.45, 0.67, -0.55, 0.78],
              [-0.23, -0.45, 1.0, -0.12, 0.34, -0.28],
              [0.45, 0.67, -0.12, 1.0, -0.23, 0.56],
              [-0.78, -0.55, 0.34, -0.23, 1.0, -0.45],
              [0.32, 0.78, -0.28, 0.56, -0.45, 1.0]
            ],
            description: 'Relaciones entre variables clave del negocio online'
          }
        };
      
      case 'ml':
        return {
          title: 'Predicción de Conversión de Clientes',
          type: 'confusion',
          data: {
            labels: ['Predicho: No Compra', 'Predicho: Compra'],
            actual: ['Real: No Compra', 'Real: Compra'],
            matrix: [[1250, 180], [95, 475]],
            accuracy: 0.863,
            description: 'Modelo de ML para predecir probabilidad de compra'
          }
        };
      
      case 'timeseries':
        return {
          title: 'Evolución de Ventas Mensuales',
          type: 'timeseries',
          data: {
            dates: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            values: [120000, 135000, 142000, 138000, 155000, 168000, 175000, 182000, 190000, 195000, 210000, 225000],
            trend: 'Creciente',
            seasonality: 'Alta en Nov-Dic',
            description: 'Tendencias de ventas y estacionalidad del ecommerce'
          }
        };
      
      case 'distributions':
        return {
          title: 'Distribución de Edades de Clientes',
          type: 'histogram',
          data: {
            bins: ['18-25', '26-35', '36-45', '46-55', '56-65', '65+'],
            frequencies: [25, 35, 28, 15, 8, 4],
            mean: 35.2,
            std: 12.8,
            description: 'Análisis demográfico de la base de clientes'
          }
        };
      
      case 'clustering':
        return {
          title: 'Segmentación de Clientes por Comportamiento',
          type: 'scatter',
          data: {
            clusters: [
              { x: [20, 25, 30, 35], y: [40, 45, 50, 55], color: '#3B82F6', label: 'Clientes Premium' },
              { x: [60, 65, 70, 75], y: [30, 35, 40, 45], color: '#10B981', label: 'Clientes Frecuentes' },
              { x: [40, 45, 50, 55], y: [70, 75, 80, 85], color: '#F59E0B', label: 'Clientes Ocasionales' },
              { x: [80, 85, 90, 95], y: [60, 65, 70, 75], color: '#EF4444', label: 'Clientes Nuevos' }
            ],
            silhouette: 0.72,
            description: 'Segmentación de clientes basada en frecuencia y valor de compra'
          }
        };
      
      default:
        return null;
    }
  };

  const renderChart = () => {
    if (!chartData) return null;

    switch (chartData.type) {
      case 'boxplot':
        return <BoxPlot data={chartData.data} />;
      case 'heatmap':
        return <Heatmap data={chartData.data} />;
      case 'confusion':
        return <ConfusionMatrix data={chartData.data} />;
      case 'timeseries':
        return <TimeSeries data={chartData.data} />;
      case 'histogram':
        return <Histogram data={chartData.data} />;
      case 'scatter':
        return <ScatterPlot data={chartData.data} />;
      default:
        return null;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="python-chart-overlay">
      <div className="python-chart-modal">
        <div className="chart-header">
          <h3>{chartData?.title || 'Generando gráfica...'}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="chart-content">
          {isLoading ? (
            <div className="chart-loading">
              <div className="python-spinner"></div>
              <p>Ejecutando código Python...</p>
              <div className="code-simulation">
                <code>import matplotlib.pyplot as plt</code><br/>
                <code>import seaborn as sns</code><br/>
                <code>import numpy as np</code><br/>
                <code>plt.figure(figsize=(10, 6))</code><br/>
                <code># Generando datos...</code>
              </div>
            </div>
          ) : (
            <div className="chart-container">
              {renderChart()}
              <div className="chart-description">
                <p>{chartData?.data.description}</p>
                <div className="python-info">
                  <span className="python-tag">Python</span>
                  <span className="library-tag">Matplotlib</span>
                  <span className="library-tag">Seaborn</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componentes de gráficas individuales
const BoxPlot: React.FC<{ data: any }> = ({ data }) => (
  <div className="chart-boxplot">
    <div className="chart-title">Distribución de Precios por Categoría</div>
    <svg width="600" height="400" viewBox="0 0 600 400">
      {/* Ejes */}
      <line x1="80" y1="50" x2="80" y2="350" stroke="#333" strokeWidth="2"/>
      <line x1="80" y1="350" x2="520" y2="350" stroke="#333" strokeWidth="2"/>
      
      {/* Box plots para cada categoría */}
      {data.categories.map((category: string, index: number) => {
        const x = 120 + index * 100;
        const values = data.values[index];
        const q1 = values[1];
        const q2 = values[2];
        const q3 = values[3];
        const min = values[0];
        const max = values[4];
        
        return (
          <g key={category}>
            {/* Box */}
            <rect x={x-20} y={350-((q3/1000)*200)} width="40" height={((q3-q1)/1000)*200} 
                  fill="rgba(59, 130, 246, 0.1)" stroke="#3B82F6" strokeWidth="2"/>
            {/* Median line */}
            <line x1={x-20} y1={350-((q2/1000)*200)} x2={x+20} y2={350-((q2/1000)*200)} 
                  stroke="#3B82F6" strokeWidth="3"/>
            {/* Whiskers */}
            <line x1={x} y1={350-((min/1000)*200)} x2={x} y2={350-((q1/1000)*200)} 
                  stroke="#3B82F6" strokeWidth="2"/>
            <line x1={x} y1={350-((q3/1000)*200)} x2={x} y2={350-((max/1000)*200)} 
                  stroke="#3B82F6" strokeWidth="2"/>
            {/* Whisker caps */}
            <line x1={x-5} y1={350-((min/1000)*200)} x2={x+5} y2={350-((min/1000)*200)} 
                  stroke="#3B82F6" strokeWidth="2"/>
            <line x1={x-5} y1={350-((max/1000)*200)} x2={x+5} y2={350-((max/1000)*200)} 
                  stroke="#3B82F6" strokeWidth="2"/>
            {/* Category label */}
            <text x={x} y="380" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="600">{category}</text>
          </g>
        );
      })}
      
      {/* Labels */}
      <text x="300" y="30" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="600">Distribución de Precios por Categoría</text>
      <text x="40" y="200" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="600" transform="rotate(-90, 40, 200)">Precio ($)</text>
    </svg>
  </div>
);

const Heatmap: React.FC<{ data: any }> = ({ data }) => (
  <div className="chart-heatmap">
    <div className="chart-title">Matriz de Correlaciones</div>
    <div className="heatmap-container">
      <div className="heatmap-grid">
        {data.matrix.map((row: number[], i: number) => 
          row.map((value: number, j: number) => (
            <div 
              key={`${i}-${j}`} 
              className="heatmap-cell"
              style={{
                backgroundColor: value > 0 ? 
                  `rgba(59, 130, 246, ${Math.abs(value)})` : 
                  `rgba(239, 68, 68, ${Math.abs(value)})`,
                color: Math.abs(value) > 0.5 ? 'white' : 'black'
              }}
            >
              {value.toFixed(2)}
            </div>
          ))
        )}
      </div>
      <div className="heatmap-labels">
        <div className="row-labels">
          {data.labels.map((label: string, i: number) => (
            <div key={i} className="label">{label}</div>
          ))}
        </div>
        <div className="col-labels">
          {data.labels.map((label: string, i: number) => (
            <div key={i} className="label">{label}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ConfusionMatrix: React.FC<{ data: any }> = ({ data }) => (
  <div className="chart-confusion">
    <div className="chart-title">Matriz de Confusión - Modelo ML</div>
    <div className="confusion-container">
      <div className="confusion-matrix">
        <div className="confusion-cell true-negative">{data.matrix[0][0]}</div>
        <div className="confusion-cell false-positive">{data.matrix[0][1]}</div>
        <div className="confusion-cell false-negative">{data.matrix[1][0]}</div>
        <div className="confusion-cell true-positive">{data.matrix[1][1]}</div>
      </div>
      <div className="confusion-labels">
        <div className="predicted-labels">
          <span>Predicho: No</span>
          <span>Predicho: Sí</span>
        </div>
        <div className="actual-labels">
          <span>Real: No</span>
          <span>Real: Sí</span>
        </div>
      </div>
      <div className="confusion-info">
        <p>Accuracy: {(data.accuracy * 100).toFixed(1)}%</p>
        <p>Precision: {((data.matrix[1][1] / (data.matrix[1][1] + data.matrix[0][1])) * 100).toFixed(1)}%</p>
        <p>Recall: {((data.matrix[1][1] / (data.matrix[1][1] + data.matrix[1][0])) * 100).toFixed(1)}%</p>
      </div>
    </div>
  </div>
);

const TimeSeries: React.FC<{ data: any }> = ({ data }) => (
  <div className="chart-timeseries">
    <div className="chart-title">Evolución de Ventas Mensuales</div>
    <svg width="700" height="400" viewBox="0 0 700 400">
      {/* Ejes */}
      <line x1="80" y1="50" x2="80" y2="350" stroke="#333" strokeWidth="2"/>
      <line x1="80" y1="350" x2="620" y2="350" stroke="#333" strokeWidth="2"/>
      
      {/* Grid lines */}
      {[1, 2, 3, 4, 5, 6].map(i => (
        <line key={i} x1="80" y1={50 + i * 50} x2="620" y2={50 + i * 50} stroke="#E5E7EB" strokeWidth="1"/>
      ))}
      
      {/* Time series line */}
      <path 
        d={`M ${80 + (0 * 45)},${350 - (data.values[0] / 2500 * 300)} L ${80 + (1 * 45)},${350 - (data.values[1] / 2500 * 300)} L ${80 + (2 * 45)},${350 - (data.values[2] / 2500 * 300)} L ${80 + (3 * 45)},${350 - (data.values[3] / 2500 * 300)} L ${80 + (4 * 45)},${350 - (data.values[4] / 2500 * 300)} L ${80 + (5 * 45)},${350 - (data.values[5] / 2500 * 300)} L ${80 + (6 * 45)},${350 - (data.values[6] / 2500 * 300)} L ${80 + (7 * 45)},${350 - (data.values[7] / 2500 * 300)} L ${80 + (8 * 45)},${350 - (data.values[8] / 2500 * 300)} L ${80 + (9 * 45)},${350 - (data.values[9] / 2500 * 300)} L ${80 + (10 * 45)},${350 - (data.values[10] / 2500 * 300)} L ${80 + (11 * 45)},${350 - (data.values[11] / 2500 * 300)}`}
        stroke="#3B82F6" 
        strokeWidth="4" 
        fill="none"
      />
      
      {/* Data points */}
      {data.values.map((value: number, index: number) => (
        <circle key={index} cx={80 + index * 45} cy={350 - (value / 2500 * 300)} r="6" fill="#3B82F6" stroke="white" strokeWidth="2"/>
      ))}
      
      {/* Labels */}
      <text x="350" y="30" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="600">Evolución de Ventas Mensuales</text>
      <text x="40" y="200" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="600" transform="rotate(-90, 40, 200)">Ventas ($)</text>
      
      {/* Month labels */}
      {data.dates.map((date: string, index: number) => (
        <text key={index} x={80 + index * 45} y="370" textAnchor="middle" fill="#1F2937" fontSize="11" fontWeight="600">{date}</text>
      ))}
    </svg>
  </div>
);

const Histogram: React.FC<{ data: any }> = ({ data }) => (
  <div className="chart-histogram">
    <div className="chart-title">Distribución de Edades de Clientes</div>
    <svg width="600" height="400" viewBox="0 0 600 400">
      {/* Ejes */}
      <line x1="80" y1="50" x2="80" y2="350" stroke="#333" strokeWidth="2"/>
      <line x1="80" y1="350" x2="520" y2="350" stroke="#333" strokeWidth="2"/>
      
      {/* Grid lines */}
      {[1, 2, 3, 4, 5].map(i => (
        <line key={i} x1="80" y1={50 + i * 60} x2="520" y2={50 + i * 60} stroke="#E5E7EB" strokeWidth="1"/>
      ))}
      
      {/* Histogram bars */}
      {data.frequencies.map((freq: number, index: number) => (
        <rect 
          key={index}
          x={100 + index * 70} 
          y={350 - (freq * 8)} 
          width="60" 
          height={freq * 8}
          fill="#3B82F6"
          opacity="0.8"
          stroke="#1D4ED8"
          strokeWidth="1"
        />
      ))}
      
      {/* Labels */}
      <text x="300" y="30" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="600">Distribución de Edades de Clientes</text>
      <text x="40" y="200" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="600" transform="rotate(-90, 40, 200)">Frecuencia (%)</text>
      
      {/* Age range labels */}
      {data.bins.map((bin: string, index: number) => (
        <text key={index} x={130 + index * 70} y="370" textAnchor="middle" fill="#1F2937" fontSize="11" fontWeight="600">{bin}</text>
      ))}
      
      {/* Mean line */}
      <line x1="300" y1="50" x2="300" y2="350" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5"/>
      <text x="305" y="60" fill="#1F2937" fontSize="12" fontWeight="600">Edad promedio: {data.mean} años</text>
    </svg>
  </div>
);

const ScatterPlot: React.FC<{ data: any }> = ({ data }) => (
  <div className="chart-scatter">
    <div className="chart-title">Análisis de Clustering - K-Means</div>
    <svg width="500" height="350" viewBox="0 0 500 350">
      {/* Ejes */}
      <line x1="50" y1="50" x2="50" y2="300" stroke="#333" strokeWidth="2"/>
      <line x1="50" y1="300" x2="450" y2="300" stroke="#333" strokeWidth="2"/>
      
      {/* Grid lines */}
      {[1, 2, 3, 4, 5].map(i => (
        <line key={i} x1="50" y1={50 + i * 50} x2="450" y2={50 + i * 50} stroke="#E5E7EB" strokeWidth="1"/>
      ))}
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <line key={i} x1={50 + i * 50} y1="50" x2={50 + i * 50} y2="300" stroke="#E5E7EB" strokeWidth="1"/>
      ))}
      
      {/* Clusters */}
      {data.clusters.map((cluster: any, clusterIndex: number) => 
        cluster.x.map((x: number, pointIndex: number) => (
          <circle 
            key={`${clusterIndex}-${pointIndex}`}
            cx={50 + x * 4} 
            cy={300 - (cluster.y[pointIndex] * 2.5)} 
            r="6" 
            fill={cluster.color}
            stroke="white"
            strokeWidth="2"
          />
        ))
      )}
      
      {/* Labels */}
      <text x="250" y="30" textAnchor="middle" fill="#1F2937" fontSize="14" fontWeight="600">Segmentación de Clientes</text>
      <text x="30" y="175" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="600" transform="rotate(-90, 30, 175)">Variable Y</text>
      <text x="250" y="330" textAnchor="middle" fill="#1F2937" fontSize="12" fontWeight="600">Variable X</text>
      
      {/* Legend */}
      <g transform="translate(350, 60)">
        {data.clusters.map((cluster: any, index: number) => (
          <g key={index}>
            <circle cx="0" cy={index * 25} r="6" fill={cluster.color} stroke="white" strokeWidth="2"/>
            <text x="15" y={index * 25 + 5} fill="#1F2937" fontSize="11" fontWeight="600">{cluster.label}</text>
          </g>
        ))}
        <text x="0" y="-10" fill="#1F2937" fontSize="12" fontWeight="600">Clusters:</text>
      </g>
    </svg>
  </div>
);

export default PythonChart;
