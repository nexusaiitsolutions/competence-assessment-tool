import React from 'react';

const Card = ({ 
  title, 
  children, 
  footer, 
  className = '', 
  headerAction,
  loading = false,
  error = null
}) => {
  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`card ${className}`}>
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '1.125rem', 
              fontWeight: '600',
              color: '#1e293b'
            }}>
              {title}
            </h3>
            {headerAction && (
              <div>
                {headerAction}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div>
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;