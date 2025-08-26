import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
    timeout: 15000, // 15 seconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log requests in development
        if (process.env.NODE_ENV === 'development') {
            console.log('🚀 API Request:', {
                method: config.method?.toUpperCase(),
                url: config.url,
                data: config.data,
                params: config.params
            });
        }
        
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle common responses and errors
api.interceptors.response.use(
    (response) => {
        // Log responses in development
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ API Response:', {
                status: response.status,
                url: response.config.url,
                data: response.data
            });
        }
        
        return response;
    },
    (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;
            
            switch (status) {
                case 401:
                    // Unauthorized - clear auth data and redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    
                    // Only redirect if not already on login page
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                    break;
                    
                case 403:
                    // Forbidden - show appropriate message
                    console.warn('Access denied:', data.error);
                    break;
                    
                case 404:
                    // Not found
                    console.warn('Resource not found:', error.config.url);
                    break;
                    
                case 422:
                    // Validation error
                    console.warn('Validation error:', data.details || data.error);
                    break;
                    
                case 429:
                    // Rate limit exceeded
                    console.warn('Rate limit exceeded. Please try again later.');
                    break;
                    
                case 500:
                case 502:
                case 503:
                case 504:
                    // Server errors
                    console.error('Server error:', data.error || 'Internal server error');
                    break;
                    
                default:
                    console.error('API Error:', data.error || 'Unknown error');
            }
            
            // Log error details in development
            if (process.env.NODE_ENV === 'development') {
                console.error('❌ API Error Response:', {
                    status,
                    statusText: error.response.statusText,
                    url: error.config.url,
                    data: data
                });
            }
            
        } else if (error.request) {
            // Network error or no response
            console.error('Network error:', error.message);
            
            // Check if it's a timeout
            if (error.code === 'ECONNABORTED') {
                console.error('Request timeout');
            }
            
        } else {
            // Something else happened
            console.error('Request setup error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// API helper methods
export const apiMethods = {
    // GET request
    get: (url, config = {}) => api.get(url, config),
    
    // POST request
    post: (url, data = {}, config = {}) => api.post(url, data, config),
    
    // PUT request
    put: (url, data = {}, config = {}) => api.put(url, data, config),
    
    // PATCH request
    patch: (url, data = {}, config = {}) => api.patch(url, data, config),
    
    // DELETE request
    delete: (url, config = {}) => api.delete(url, config),
    
    // Upload file
    upload: (url, formData, config = {}) => {
        return api.post(url, formData, {
            ...config,
            headers: {
                ...config.headers,
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    
    // Download file
    download: (url, filename, config = {}) => {
        return api.get(url, {
            ...config,
            responseType: 'blob',
        }).then(response => {
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        });
    }
};

// Set auth token
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete api.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

// Clear auth token
export const clearAuthToken = () => {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export default api;