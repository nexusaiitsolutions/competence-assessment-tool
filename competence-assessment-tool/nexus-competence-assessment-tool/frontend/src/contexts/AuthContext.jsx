import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/apiClient.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');

                if (token && userData) {
                    const parsedUser = JSON.parse(userData);
                    
                    // Verify token is still valid by making a test request
                    try {
                        const response = await api.get('/users/me');
                        setUser(response.data);
                    } catch (error) {
                        // Token is invalid, clear storage
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
                setError('Failed to initialize authentication');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // Login function
    const login = useCallback(async (email, password) => {
        console.log("Testing");
        try {
            setLoading(true);
            setError(null);

            const response = await api.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password
            });
            console.log("1"+response.data);
            const { token, user: userData } = response.data;

            // Store auth data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Update state
            setUser(userData);
            
            return { success: true, user: userData };

        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    // Logout function
    const logout = useCallback(async () => {
        try {
            // Attempt to call logout endpoint (optional)
            try {
                await api.post('/auth/logout');
            } catch (error) {
                // Ignore errors from logout endpoint
                console.warn('Logout endpoint failed:', error);
            }
        } finally {
            // Always clear local state and storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setError(null);
        }
    }, []);

    // Update user data
    const updateUser = useCallback((userData) => {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }, [user]);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Check if user has specific role
    const hasRole = useCallback((roles) => {
        if (!user) return false;
        if (typeof roles === 'string') {
            return user.role_type === roles;
        }
        if (Array.isArray(roles)) {
            return roles.includes(user.role_type);
        }
        return false;
    }, [user]);

    // Check if user is admin
    const isAdmin = useCallback(() => {
        return hasRole(['admin', 'hr']);
    }, [hasRole]);

    // Check if user is manager
    const isManager = useCallback(() => {
        return hasRole(['manager', 'leader', 'admin', 'hr']);
    }, [hasRole]);

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        updateUser,
        clearError,
        hasRole,
        isAdmin,
        isManager,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;