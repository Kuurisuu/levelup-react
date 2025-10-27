import React from 'react';
import { ReportType } from '../../types/reports';

interface ReportButtonProps {
  type: ReportType;
  icon: string;
  title: string;
  description: string;
  features: string[];
  onGenerate: (reportType: ReportType) => void;
  onShowChart: (reportType: ReportType) => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({
  type,
  icon,
  title,
  description,
  features,
  onGenerate,
  onShowChart
}) => {
  const handleGenerate = () => {
    onGenerate(type);
  };

  const handleShowChart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShowChart(type);
  };

  return (
    <div className="report-button" onClick={handleGenerate}>
      <div className="report-icon">{icon}</div>
      <div className="report-content">
        <h4>{title}</h4>
        <p>{description}</p>
        <div className="report-features">
          {features.map((feature, index) => (
            <span key={index} className="feature-tag">
              {feature}
            </span>
          ))}
        </div>
      </div>
      <div className="report-actions">
        <button 
          className="chart-button" 
          onClick={handleShowChart}
          title="Ver gráfica Python"
        >
          Ver Gráfica
        </button>
        <div className="report-action">
          <span className="action-text">Generar PDF</span>
          <div className="action-icon">→</div>
        </div>
      </div>
    </div>
  );
};

export default ReportButton;
