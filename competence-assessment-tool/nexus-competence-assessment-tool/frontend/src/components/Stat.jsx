import React from 'react';

const Stat = ({ label, value, trend, icon, color = 'primary' }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'danger':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="stat">
      {icon && (
        <div style={{ 
          fontSize: '1.5rem', 
          marginBottom: '0.5rem',
          opacity: 0.8 
        }}>
          {icon}
        </div>
      )}
      
      <div className="value">
        {value}
      </div>
      
      <div className="label">
        {label}
      </div>
      
      {trend && (
        <div style={{
          marginTop: '0.5rem',
          fontSize: '0.75rem',
          fontWeight: '500',
          color: trend.startsWith('+') ? '#10b981' : '#ef4444'
        }}>
          {trend}
        </div>
      )}
    </div>
  );
};

export default Stat;