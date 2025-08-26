import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Login = () => {
  const { login, loading, error, clearError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: 'admin@nexusai.com',
    password: 'password123'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Demo accounts for easy switching
  const demoAccounts = [
    { email: 'admin@nexusai.com', password: 'password123', role: 'Admin', name: 'System Admin' },
    { email: 'hr@nexusai.com', password: 'password123', role: 'HR', name: 'Sarah Johnson' },
    { email: 'manager@nexusai.com', password: 'password123', role: 'Manager', name: 'Mike Wilson' },
    { email: 'john.doe@nexusai.com', password: 'password123', role: 'Employee', name: 'John Doe' },
    { email: 'jane.smith@nexusai.com', password: 'password123', role: 'Senior Employee', name: 'Jane Smith' },
    { email: 'leader@nexusai.com', password: 'password123', role: 'Leader', name: 'David Brown' }
  ];

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component mounts or form data changes
  useEffect(() => {
    clearError();
    setValidationErrors({});
  }, [formData, clearError]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 1) {
      errors.password = 'Password cannot be empty';
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDemoAccountSelect = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    });
    clearError();
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || loading) return;
    
    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setValidationErrors({});
    
    try {
      const result = await login(formData.email.trim(), formData.password);
      
      if (result && result.success) {
        // Login successful, navigation will be handled by useEffect
        console.log('Login successful');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Error handling is done in the AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.email.trim() && formData.password && Object.keys(validationErrors).length === 0;

  if (loading) {
    return (
      <div className="login-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="login-header">
          <h1 className="login-title">Welcome to CAT</h1>
          <p className="login-subtitle">Nexus Competence Assessment Tool - Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`input ${validationErrors.email ? 'error' : ''}`}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
              aria-describedby={validationErrors.email ? "email-error" : undefined}
            />
            {validationErrors.email && (
              <div id="email-error" className="error-message" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {validationErrors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="label">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className={`input ${validationErrors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isSubmitting}
                style={{ paddingRight: '2.5rem' }}
                aria-describedby={validationErrors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isSubmitting}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.25rem',
                  minHeight: 'auto',
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {validationErrors.password && (
              <div id="password-error" className="error-message" style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {validationErrors.password}
              </div>
            )}
          </div>

          {error && (
            <div className="error-message" role="alert">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className={`btn btn-primary ${!isFormValid || isSubmitting ? 'opacity-50' : ''}`}
            disabled={!isFormValid || isSubmitting}
            style={{
              opacity: !isFormValid || isSubmitting ? 0.5 : 1,
              cursor: !isFormValid || isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? (
              <>
                <div className="loading-spinner" style={{ width: '16px', height: '16px' }}></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Demo Accounts Section */}
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem', color: '#374151' }}>
            🎯 Quick Demo Access
          </h3>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDemoAccountSelect(account)}
                disabled={isSubmitting}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: formData.email === account.email ? '#dbeafe' : '#ffffff',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.75rem',
                  transition: 'all 0.2s ease',
                  opacity: isSubmitting ? 0.5 : 1
                }}
                className="demo-account-btn"
              >
                <span style={{ fontWeight: '500', color: '#374151' }}>{account.name}</span>
                <span style={{ 
                  padding: '0.125rem 0.375rem', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '0.25rem',
                  fontSize: '0.625rem',
                  fontWeight: '500',
                  color: '#6b7280'
                }}>
                  {account.role}
                </span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
            All demo accounts use password: <code style={{ backgroundColor: '#f1f5f9', padding: '0.125rem 0.25rem', borderRadius: '0.25rem' }}>password123</code>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#6b7280' }}>
          <p>
            Need help? Contact your system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;