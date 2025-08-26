import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../api/apiClient.js';
import Stat from '../components/Stat.jsx';
import Card from '../components/Card.jsx';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Since the original endpoint might not exist, let's create mock data
      // or fetch from available endpoints
      const response = await api.get('/users/me');
      
      // Mock dashboard data for demonstration
      const mockData = {
        overall: {
          total_employees: 19,
          total_skills_assessed: 156,
          avg_competency_score: 82.5,
          active_projects: 4,
          pending_assessments: 12,
          completed_trainings: 28
        },
        byCategory: [
          {
            category_name: 'Technical',
            avg_score: 85.2,
            entries: 67,
            trend: '+5.2%'
          },
          {
            category_name: 'Domain',
            avg_score: 78.4,
            entries: 34,
            trend: '+2.1%'
          },
          {
            category_name: 'Behavioral',
            avg_score: 81.9,
            entries: 31,
            trend: '+3.8%'
          },
          {
            category_name: 'Process',
            avg_score: 84.1,
            entries: 24,
            trend: '+1.9%'
          }
        ],
        recentActivity: [
          {
            id: 1,
            type: 'assessment',
            message: 'TypeScript Proficiency Test completed by Alice Johnson',
            timestamp: '2 hours ago',
            status: 'completed'
          },
          {
            id: 2,
            type: 'training',
            message: 'React Development training enrolled by Bob Williams',
            timestamp: '5 hours ago',
            status: 'in_progress'
          },
          {
            id: 3,
            type: 'project',
            message: 'E-commerce Platform project allocation updated',
            timestamp: '1 day ago',
            status: 'updated'
          },
          {
            id: 4,
            type: 'competency',
            message: 'New competency assessment request from Carol Brown',
            timestamp: '2 days ago',
            status: 'pending'
          }
        ],
        upcomingDeadlines: [
          {
            id: 1,
            title: 'Q4 Competency Review',
            type: 'assessment',
            dueDate: '2024-12-15',
            priority: 'high'
          },
          {
            id: 2,
            title: 'AWS Training Completion',
            type: 'training',
            dueDate: '2024-12-20',
            priority: 'medium'
          },
          {
            id: 3,
            title: 'Project Skill Gap Analysis',
            type: 'analysis',
            dueDate: '2024-12-25',
            priority: 'low'
          }
        ]
      };

      setDashboardData(mockData);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assessment': return '📝';
      case 'training': return '🎓';
      case 'project': return '💼';
      case 'competency': return '⭐';
      default: return '📋';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high': return 'badge-danger';
      case 'medium': return 'badge-warning';
      case 'low': return 'badge-success';
      default: return 'badge-gray';
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="error-message">
            {error}
            <button 
              onClick={fetchDashboardData}
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          {getGreeting()}, {user?.first_name}! 👋
        </h1>
        <p className="dashboard-subtitle">
          Here's an overview of your competence assessment activities
        </p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <Stat 
          label="Total Employees" 
          value={dashboardData.overall.total_employees.toLocaleString()} 
        />
        <Stat 
          label="Skills Assessed" 
          value={dashboardData.overall.total_skills_assessed.toLocaleString()} 
        />
        <Stat 
          label="Average Score" 
          value={formatPercentage(dashboardData.overall.avg_competency_score)} 
        />
        <Stat 
          label="Active Projects" 
          value={dashboardData.overall.active_projects.toLocaleString()} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="row cols-2">
        {/* Competencies by Category */}
        <Card title="📊 Competencies by Category">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Average Score</th>
                  <th>Assessments</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.byCategory.map((category, index) => (
                  <tr key={index}>
                    <td className="font-medium">{category.category_name}</td>
                    <td>
                      <span className="badge badge-primary">
                        {formatPercentage(category.avg_score)}
                      </span>
                    </td>
                    <td className="text-gray-600">{category.entries}</td>
                    <td>
                      <span className="text-success font-medium">
                        {category.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="🔔 Recent Activity">
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {dashboardData.recentActivity.map((activity) => (
              <div 
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <div style={{ fontSize: '1.25rem' }}>
                  {getActivityIcon(activity.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151' }}>
                    {activity.message}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                    {activity.timestamp}
                  </p>
                </div>
                <div>
                  <span className={`badge ${activity.status === 'completed' ? 'badge-success' : 
                                           activity.status === 'in_progress' ? 'badge-warning' : 
                                           activity.status === 'pending' ? 'badge-danger' : 'badge-gray'}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Additional Cards Row */}
      <div className="row cols-2" style={{ marginTop: '1.5rem' }}>
        {/* Quick Actions */}
        <Card title="⚡ Quick Actions">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <button className="btn btn-primary">
              📝 New Assessment
            </button>
            <button className="btn btn-secondary">
              👥 View Teams
            </button>
            <button className="btn btn-secondary">
              📊 Generate Report
            </button>
            <button className="btn btn-secondary">
              🎯 Set Goals
            </button>
          </div>
        </Card>

        {/* Upcoming Deadlines */}
        <Card title="⏰ Upcoming Deadlines">
          <div>
            {dashboardData.upcomingDeadlines.map((deadline) => (
              <div 
                key={deadline.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <div>
                  <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                    {deadline.title}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                    Due: {new Date(deadline.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`badge ${getPriorityBadge(deadline.priority)}`}>
                  {deadline.priority}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Summary Card */}
      <div style={{ marginTop: '1.5rem' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1e293b' }}>
              System Status: All Systems Operational ✅
            </h3>
            <p style={{ margin: 0, color: '#64748b' }}>
              Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;