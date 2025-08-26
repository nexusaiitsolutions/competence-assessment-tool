import React, { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ThemeProvider, ThemeToggle } from './components/ThemeToggle.jsx';
import Layout from './components/Layout.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';

// Import styles
import './styles/styles.css';

// Lazy load components for better performance
const Login = React.lazy(() => import('./pages/Login.jsx'));
const Dashboard = React.lazy(() => import('./pages/Dashboard.jsx'));
const NotFound = React.lazy(() => import('./pages/NotFound.jsx'));

// Placeholder components for future pages
const Skills = () => <div className="container"><div className="card"><h1>Skills Management</h1><p>Skills management functionality will be implemented here.</p></div></div>;
const Assessments = () => <div className="container"><div className="card"><h1>Assessments</h1><p>Assessment management functionality will be implemented here.</p></div></div>;
const Competencies = () => <div className="container"><div className="card"><h1>Competencies</h1><p>Competency tracking functionality will be implemented here.</p></div></div>;
const Training = () => <div className="container"><div className="card"><h1>Training Programs</h1><p>Training management functionality will be implemented here.</p></div></div>;
const Projects = () => <div className="container"><div className="card"><h1>Projects</h1><p>Project management functionality will be implemented here.</p></div></div>;
const Reports = () => <div className="container"><div className="card"><h1>Reports & Analytics</h1><p>Reports and analytics functionality will be implemented here.</p></div></div>;

// Loading component
const PageLoader = () => (
  <div className="loading-container">
    <LoadingSpinner />
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role_type)) {
    return (
      <Layout>
        <div className="container">
          <div className="card text-center">
            <div className="p-6">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-danger mb-3">
                Access Denied
              </h2>
              <p className="text-secondary">
                You don't have permission to access this page.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return <Layout>{children}</Layout>;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container">
          <div className="card text-center">
            <div className="p-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-danger mb-3">
                Something went wrong
              </h2>
              <p className="text-secondary mb-4">
                An unexpected error occurred. Please refresh the page or try again later.
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  useEffect(() => {
    // Set up global error handling
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    const handleError = (event) => {
      console.error('Global error:', event.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <div className="app-root">
            <ThemeToggle />
            
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />

                {/* Protected Routes */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/skills" 
                  element={
                    <ProtectedRoute>
                      <Skills />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/assessments" 
                  element={
                    <ProtectedRoute allowedRoles={['hr', 'manager', 'admin', 'employee']}>
                      <Assessments />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/competencies" 
                  element={
                    <ProtectedRoute>
                      <Competencies />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/training" 
                  element={
                    <ProtectedRoute>
                      <Training />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/projects" 
                  element={
                    <ProtectedRoute allowedRoles={['manager', 'hr', 'admin', 'leader']}>
                      <Projects />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute allowedRoles={['manager', 'hr', 'admin', 'leader']}>
                      <Reports />
                    </ProtectedRoute>
                  } 
                />

                {/* 404 Route */}
                <Route 
                  path="*" 
                  element={
                    <ProtectedRoute>
                      <NotFound />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Suspense>
          </div>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;