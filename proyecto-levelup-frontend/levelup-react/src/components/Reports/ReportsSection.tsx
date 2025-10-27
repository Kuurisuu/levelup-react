import React from 'react';
import ReportButton from './ReportButton';
import { ReportType } from '../../types/reports';

interface ReportsSectionProps {
  onGenerateReport: (reportType: ReportType) => void;
  onShowChart: (reportType: ReportType) => void;
}

const ReportsSection: React.FC<ReportsSectionProps> = ({ onGenerateReport, onShowChart }) => {
  const reportTypes: Array<{
    type: ReportType;
    icon: string;
    title: string;
    description: string;
    features: string[];
  }> = [
    {
      type: 'quartiles',
      icon: 'Q',
      title: 'Análisis de Quartiles',
      description: 'Distribución estadística de ventas y outliers',
      features: ['Box Plot', 'Outliers', 'PDF']
    },
    {
      type: 'correlations',
      icon: 'C',
      title: 'Matriz de Correlaciones',
      description: 'Relaciones entre variables del negocio',
      features: ['Heatmap', 'Pearson', 'PDF']
    },
    {
      type: 'ml',
      icon: 'ML',
      title: 'Predicciones ML',
      description: 'Modelos de regresión y clasificación',
      features: ['Scikit-learn', 'Accuracy', 'PDF']
    },
    {
      type: 'timeseries',
      icon: 'T',
      title: 'Análisis Temporal',
      description: 'Tendencias y estacionalidad de datos',
      features: ['ARIMA', 'Seasonal', 'PDF']
    },
    {
      type: 'distributions',
      icon: 'D',
      title: 'Distribuciones Estadísticas',
      description: 'Histogramas y pruebas de normalidad',
      features: ['Histogram', 'Kolmogorov', 'PDF']
    },
    {
      type: 'clustering',
      icon: 'K',
      title: 'Análisis de Clusters',
      description: 'Segmentación de clientes y productos',
      features: ['K-Means', 'Silhouette', 'PDF']
    }
  ];

  return (
    <div className="reports-section">
      <div className="dashboard-card reports-card">
        <div className="card-header">
          <h3>Reportes de Análisis Python</h3>
          <div className="reports-info">
            <span className="reports-subtitle">Genera reportes imprimibles con análisis estadístico</span>
          </div>
        </div>
        
        <div className="reports-grid">
          {reportTypes.map((report) => (
            <ReportButton
              key={report.type}
              type={report.type}
              icon={report.icon}
              title={report.title}
              description={report.description}
              features={report.features}
              onGenerate={onGenerateReport}
              onShowChart={onShowChart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
