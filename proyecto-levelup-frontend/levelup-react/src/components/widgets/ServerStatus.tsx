import React from 'react';

interface ServerStatusProps {
  services: Array<{
    name: string;
    status: 'online' | 'warning' | 'offline';
  }>;
}

const ServerStatus: React.FC<ServerStatusProps> = ({ services }) => {
  return (
    <>
      {services.map((service, index) => (
        <div key={index} className="server-status">
          <div className={`status-indicator ${service.status}`}></div>
          <span>{service.name}: {service.status === 'online' ? 'Online' : service.status === 'warning' ? 'Latencia Alta' : 'Offline'}</span>
        </div>
      ))}
    </>
  );
};

export default ServerStatus;
