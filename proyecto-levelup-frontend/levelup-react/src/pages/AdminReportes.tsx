import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReportsSection, ReportStatus, PythonChart } from '../components/Reports';
import { useReportGenerator } from '../hooks/useReportGenerator';
import { ReportType } from '../types/reports';
import '../styles/admin.css';

const AdminReportes = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [currentReportType, setCurrentReportType] = useState<ReportType | null>(null);
  const { 
    generateReport, 
    showPythonChart, 
    hidePythonChart, 
    showChart, 
    currentChartType 
  } = useReportGenerator();

  // Función para manejar la generación de reportes con estado
  const handleGenerateReport = async (reportType: ReportType) => {
    setIsGeneratingReport(true);
    setCurrentReportType(reportType);
    
    try {
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      generateReport(reportType);
    } finally {
      setIsGeneratingReport(false);
      setCurrentReportType(null);
    }
  };

  return (
    <div className="wrapper">
      <main>
        <div className="admin-layout">
          {/* SIDEBAR */}
          <aside className="sidebar">
            <h2>Admin</h2>
            <ul>
              <li>
                <Link to="/admin/dashboard">
                  <i className="bi bi-speedometer2"></i> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/usuarios">
                  <i className="bi bi-people-fill"></i> Usuarios
                </Link>
              </li>
              <li>
                <Link to="/admin/productos">
                  <i className="bi bi-controller"></i> Productos
                </Link>
              </li>
              <li>
                <Link to="/admin/ordenes">
                  <i className="bi bi-cart-check"></i> Órdenes
                </Link>
              </li>
              <li>
                <Link to="/admin/categorias">
                  <i className="bi bi-tags"></i> Categorías
                </Link>
              </li>
              <li>
                <Link to="/admin/reportes">
                  <i className="bi bi-graph-up"></i> Reportes
                </Link>
              </li>
            </ul>
          </aside>

          {/* CONTENIDO */}
          <main className="admin-content">
            <div className="admin-header">
              <h1>Reportes de Análisis Python</h1>
              <p className="admin-subtitle">
                Genera reportes imprimibles con análisis estadístico avanzado usando librerías de Python
              </p>
            </div>

            {/* Sección de Reportes Python */}
            <ReportsSection 
              onGenerateReport={handleGenerateReport} 
              onShowChart={showPythonChart}
            />
            
            {/* Estado de generación de reportes */}
            <ReportStatus 
              isGenerating={isGeneratingReport} 
              reportType={currentReportType} 
            />

            {/* Modal de gráfica Python */}
            <PythonChart 
              reportType={currentChartType || 'quartiles'}
              isVisible={showChart}
              onClose={hidePythonChart}
            />
          </main>
        </div>
      </main>
    </div>
  );
};

export default AdminReportes;
