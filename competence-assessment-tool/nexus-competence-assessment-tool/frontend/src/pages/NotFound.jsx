import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
          🔍
        </div>
        
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: '#1e293b', 
          marginBottom: '1rem' 
        }}>
          Page Not Found
        </h1>
        
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#64748b', 
          marginBottom: '2rem',
          maxWidth: '500px',
          margin: '0 auto 2rem auto'
        }}>
          Sorry, we couldn't find the page you're looking for. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            ← Go Back
          </button>
          
          <Link to="/" className="btn btn-primary">
            🏠 Home
          </Link>
        </div>
        
        <div style={{ marginTop: '2rem', color: '#9ca3af', fontSize: '0.875rem' }}>
          Error 404
        </div>
      </div>
    </div>
  );
};

export default NotFound;