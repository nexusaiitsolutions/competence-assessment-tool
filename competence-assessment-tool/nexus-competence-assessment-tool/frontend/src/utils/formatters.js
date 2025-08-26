// Utility functions for formatting data

/**
 * Format a number as a percentage
 * @param {number} value - The value to format (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const pct = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format a number with thousands separators
 * @param {number} value - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  return Number(value).toLocaleString();
};

/**
 * Format currency
 * @param {number} value - The value to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(value);
};

/**
 * Format a date string
 * @param {string|Date} date - The date to format
 * @param {string} format - Format style (short, medium, long, full)
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    medium: { year: 'numeric', month: 'long', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    full: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }
  };
  
  return dateObj.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format a relative time (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

/**
 * Truncate text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get status badge color class
 * @param {string} status - Status value
 * @returns {string} CSS class name
 */
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    'active': 'badge-success',
    'completed': 'badge-success',
    'passed': 'badge-success',
    'approved': 'badge-success',
    
    'pending': 'badge-warning',
    'in_progress': 'badge-warning',
    'assigned': 'badge-warning',
    'review': 'badge-warning',
    
    'failed': 'badge-danger',
    'rejected': 'badge-danger',
    'cancelled': 'badge-danger',
    'expired': 'badge-danger',
    'inactive': 'badge-danger',
    
    'draft': 'badge-gray',
    'disabled': 'badge-gray',
    'archived': 'badge-gray'
  };
  
  return statusMap[status?.toLowerCase()] || 'badge-gray';
};

/**
 * Format skill level with appropriate styling
 * @param {string} level - Skill level
 * @returns {object} Object with level text and CSS class
 */
export const formatSkillLevel = (level) => {
  const levelMap = {
    'beginner': { text: 'Beginner', class: 'badge-warning' },
    'intermediate': { text: 'Intermediate', class: 'badge-primary' },
    'expert': { text: 'Expert', class: 'badge-success' },
    'advanced': { text: 'Advanced', class: 'badge-success' }
  };
  
  return levelMap[level?.toLowerCase()] || { text: level || 'Unknown', class: 'badge-gray' };
};

/**
 * Format priority with appropriate styling
 * @param {string} priority - Priority level
 * @returns {object} Object with priority text and CSS class
 */
export const formatPriority = (priority) => {
  const priorityMap = {
    'low': { text: 'Low', class: 'badge-success', color: '#10b981' },
    'medium': { text: 'Medium', class: 'badge-warning', color: '#f59e0b' },
    'high': { text: 'High', class: 'badge-danger', color: '#ef4444' },
    'critical': { text: 'Critical', class: 'badge-danger', color: '#dc2626' }
  };
  
  return priorityMap[priority?.toLowerCase()] || { text: priority || 'Medium', class: 'badge-gray', color: '#6b7280' };
};