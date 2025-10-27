import { useCallback, useState } from 'react';
import { ReportType } from '../../types/reports';

interface ReportData {
  title: string;
  description: string;
  libraries: string[];
  charts: string[];
  metrics: string[];
}

export const useReportGenerator = () => {
  const [showChart, setShowChart] = useState(false);
  const [currentChartType, setCurrentChartType] = useState<ReportType | null>(null);
  const reportData: Record<ReportType, ReportData> = {
    quartiles: {
      title: "Análisis de Quartiles - Ventas",
      description: "Distribución estadística de las ventas con identificación de outliers",
      libraries: ["matplotlib", "seaborn", "numpy", "pandas"],
      charts: ["Box Plot", "Histograma", "Q-Q Plot"],
      metrics: ["Q1: $45,230", "Q2: $67,890", "Q3: $89,450", "Outliers: 12 productos"]
    },
    correlations: {
      title: "Matriz de Correlaciones",
      description: "Análisis de relaciones entre variables del negocio",
      libraries: ["seaborn", "matplotlib", "pandas", "scipy"],
      charts: ["Heatmap", "Scatter Matrix", "Correlation Network"],
      metrics: ["Correlación Ventas-Precio: 0.78", "Correlación Ventas-Marketing: 0.65"]
    },
    ml: {
      title: "Modelos de Machine Learning",
      description: "Predicciones usando algoritmos de regresión y clasificación",
      libraries: ["scikit-learn", "matplotlib", "pandas", "numpy"],
      charts: ["Confusion Matrix", "ROC Curve", "Feature Importance"],
      metrics: ["Accuracy: 87.3%", "Precision: 0.89", "Recall: 0.85"]
    },
    timeseries: {
      title: "Análisis de Series Temporales",
      description: "Tendencias y estacionalidad en los datos históricos",
      libraries: ["statsmodels", "matplotlib", "pandas", "seaborn"],
      charts: ["Time Series Plot", "Seasonal Decomposition", "ACF/PACF"],
      metrics: ["Tendencia: Creciente", "Estacionalidad: Moderada", "R²: 0.92"]
    },
    distributions: {
      title: "Distribuciones Estadísticas",
      description: "Análisis de distribuciones y pruebas de normalidad",
      libraries: ["matplotlib", "scipy", "numpy", "pandas"],
      charts: ["Histograma", "Density Plot", "Q-Q Plot"],
      metrics: ["Shapiro-Wilk: p=0.023", "Kolmogorov-Smirnov: p=0.045"]
    },
    clustering: {
      title: "Análisis de Clustering",
      description: "Segmentación de clientes y productos usando K-Means",
      libraries: ["scikit-learn", "matplotlib", "pandas", "seaborn"],
      charts: ["Scatter Plot", "Silhouette Analysis", "Elbow Method"],
      metrics: ["Optimal Clusters: 4", "Silhouette Score: 0.67", "Inertia: 1,234"]
    }
  };

  const generateReport = useCallback((reportType: ReportType) => {
    console.log(`Generando reporte de tipo: ${reportType}`);
    
    const report = reportData[reportType];
    
    if (report) {
      // Simular generación de reporte
      alert(`📊 Generando reporte: ${report.title}\n\n${report.description}\n\nLibrerías utilizadas: ${report.libraries.join(', ')}\n\nGráficas incluidas: ${report.charts.join(', ')}\n\nMétricas principales:\n${report.metrics.join('\n')}\n\n✅ Reporte generado exitosamente!\n📄 Se ha creado un archivo PDF imprimible.`);
      
      // Simular descarga de PDF
      const pdfContent = `
        REPORTE DE ANÁLISIS PYTHON - LEVELUP
        =====================================
        
        Tipo de Reporte: ${report.title}
        Fecha de Generación: ${new Date().toLocaleDateString()}
        
        DESCRIPCIÓN:
        ${report.description}
        
        LIBRERÍAS UTILIZADAS:
        ${report.libraries.map(lib => `- ${lib}`).join('\n')}
        
        GRÁFICAS INCLUIDAS:
        ${report.charts.map(chart => `- ${chart}`).join('\n')}
        
        MÉTRICAS PRINCIPALES:
        ${report.metrics.join('\n')}
        
        GENERADO POR: Sistema de Análisis LevelUp
        TECNOLOGÍAS: Python, Matplotlib, Seaborn, Scikit-learn
      `;
      
      // Crear y descargar archivo de texto simulando PDF
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, []);

  const showPythonChart = useCallback((reportType: ReportType) => {
    setCurrentChartType(reportType);
    setShowChart(true);
  }, []);

  const hidePythonChart = useCallback(() => {
    setShowChart(false);
    setCurrentChartType(null);
  }, []);

  return { 
    generateReport, 
    showPythonChart, 
    hidePythonChart, 
    showChart, 
    currentChartType 
  };
};
