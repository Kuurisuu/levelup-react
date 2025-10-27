import React from 'react';

interface AlertCardProps {
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  message: string;
  icon: string;
  actionText?: string;
  onAction?: () => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ 
  type, 
  title, 
  message, 
  icon, 
  actionText, 
  onAction 
}) => {
  return (
    <div className={`alert-card ${type}`}>
      <div className="alert-icon">
        <i className={icon}></i>
      </div>
      <div className="alert-content">
        <h3>{title}</h3>
        <p>{message}</p>
        {actionText && onAction && (
          <div className="alert-actions">
            <button className="btn-alert" onClick={onAction}>
              {actionText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCard;
