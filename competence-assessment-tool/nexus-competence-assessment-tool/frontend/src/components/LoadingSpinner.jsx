import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', text = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10', 
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const spinnerStyle = {
    width: size === 'sm' ? '24px' : size === 'lg' ? '64px' : size === 'xl' ? '96px' : '40px',
    height: size === 'sm' ? '24px' : size === 'lg' ? '64px' : size === 'xl' ? '96px' : '40px',
  };

  return (
    <div className={`d-flex flex-col items-center justify-center ${className}`}>
      <div 
        className="loading-spinner"
        style={spinnerStyle}
        role="status"
        aria-label="Loading"
      ></div>
      {text && (
        <p className="mt-3 text-secondary text-sm font-medium">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;