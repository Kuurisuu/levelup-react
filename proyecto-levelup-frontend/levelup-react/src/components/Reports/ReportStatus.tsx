import React from 'react';

interface ReportStatusProps {
  isGenerating: boolean;
  reportType: string | null;
}

const ReportStatus: React.FC<ReportStatusProps> = ({ isGenerating, reportType }) => {
  if (!isGenerating) return null;

  return (
    <div className="report-status">
      <div className="report-status-content">
        <div className="loading-spinner"></div>
        <div className="status-text">
          <h4>Generando reporte...</h4>
          <p>Procesando datos con Python y generando gráficas</p>
          {reportType && (
            <span className="report-type">Tipo: {reportType}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportStatus;
