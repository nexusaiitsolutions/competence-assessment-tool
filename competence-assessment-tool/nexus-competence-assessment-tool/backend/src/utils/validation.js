// src/utils/validation.js
const { validationResult } = require('express-validator');
const logger = require('./logger');

/**
 * Middleware to handle validation errors
 */
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const validationErrors = errors.array();
        
        // Log validation errors
        logger.warn('Validation failed:', {
            url: req.originalUrl,
            method: req.method,
            errors: validationErrors,
            body: req.body,
            userAgent: req.get('User-Agent'),
            ip: req.ip
        });
        
        // Format errors for response
        const formattedErrors = validationErrors.reduce((acc, error) => {
            const field = error.param || error.path;
            if (!acc[field]) {
                acc[field] = [];
            }
            acc[field].push(error.msg);
            return acc;
        }, {});
        
        return res.status(422).json({
            error: 'Validation failed',
            success: false,
            details: formattedErrors,
            message: 'Please check your input data'
        });
    }
    
    next();
};

/**
 * Custom validation helpers
 */
const customValidators = {
    /**
     * Validate employee ID format
     */
    isValidEmployeeId: (value) => {
        if (!value) return false;
        // Expected format: EMP followed by digits (e.g., EMP001)
        return /^EMP\d{3,6}$/.test(value);
    },
    
    /**
     * Validate role type
     */
    isValidRoleType: (value) => {
        const validRoles = ['employee', 'manager', 'hr', 'admin', 'leader'];
        return validRoles.includes(value);
    },
    
    /**
     * Validate skill level
     */
    isValidSkillLevel: (value) => {
        const validLevels = ['Beginner', 'Intermediate', 'Expert'];
        return validLevels.includes(value);
    },
    
    /**
     * Validate score range
     */
    isValidScore: (value) => {
        const score = parseInt(value);
        return !isNaN(score) && score >= 0 && score <= 100;
    },
    
    /**
     * Validate percentage
     */
    isValidPercentage: (value) => {
        const percentage = parseFloat(value);
        return !isNaN(percentage) && percentage >= 0 && percentage <= 100;
    },
    
    /**
     * Validate email format (more strict than express-validator default)
     */
    isValidEmail: (value) => {
        if (!value) return false;
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(value) && value.length <= 254;
    },
    
    /**
     * Validate password strength
     */
    isStrongPassword: (value) => {
        if (!value || typeof value !== 'string') return false;
        
        return (
            value.length >= 8 && // At least 8 characters
            /[a-z]/.test(value) && // At least one lowercase letter
            /[A-Z]/.test(value) && // At least one uppercase letter
            /\d/.test(value) && // At least one digit
            /[!@#$%^&*(),.?":{}|<>]/.test(value) // At least one special character
        );
    },
    
    /**
     * Validate date format (YYYY-MM-DD)
     */
    isValidDate: (value) => {
        if (!value) return false;
        const date = new Date(value);
        return date instanceof Date && !isNaN(date) && value.match(/^\d{4}-\d{2}-\d{2}$/);
    },
    
    /**
     * Validate phone number (flexible format)
     */
    isValidPhone: (value) => {
        if (!value) return true; // Phone is optional
        // Accepts formats: +1234567890, (123) 456-7890, 123-456-7890, etc.
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$|^[\+]?[\d\s\-\(\)]{10,20}$/;
        return phoneRegex.test(value.replace(/\s/g, ''));
    }
};

/**
 * Sanitize input data
 */
const sanitizeInput = {
    /**
     * Sanitize string input
     */
    string: (value) => {
        if (typeof value !== 'string') return value;
        return value.trim().replace(/\s+/g, ' '); // Remove extra whitespace
    },
    
    /**
     * Sanitize email
     */
    email: (value) => {
        if (typeof value !== 'string') return value;
        return value.toLowerCase().trim();
    },
    
    /**
     * Sanitize numeric input
     */
    number: (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? null : num;
    },
    
    /**
     * Sanitize integer input
     */
    integer: (value) => {
        const int = parseInt(value);
        return isNaN(int) ? null : int;
    },
    
    /**
     * Sanitize boolean input
     */
    boolean: (value) => {
        if (typeof value === 'boolean') return value;
        if (typeof value === 'string') {
            const lower = value.toLowerCase();
            if (lower === 'true' || lower === '1' || lower === 'yes') return true;
            if (lower === 'false' || lower === '0' || lower === 'no') return false;
        }
        return null;
    }
};

/**
 * Common validation chains for reuse
 */
const commonValidations = {
    email: [
        require('express-validator').body('email')
            .isEmail()
            .withMessage('Must be a valid email address')
            .normalizeEmail()
            .isLength({ max: 254 })
            .withMessage('Email address too long')
    ],
    
    password: [
        require('express-validator').body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .isLength({ max: 128 })
            .withMessage('Password too long')
    ],
    
    strongPassword: [
        require('express-validator').body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character')
    ],
    
    employeeId: [
        require('express-validator').body('employee_id')
            .custom(customValidators.isValidEmployeeId)
            .withMessage('Employee ID must be in format EMP followed by 3-6 digits (e.g., EMP001)')
    ],
    
    roleType: [
        require('express-validator').body('role_type')
            .custom(customValidators.isValidRoleType)
            .withMessage('Role type must be one of: employee, manager, hr, admin, leader')
    ]
};

module.exports = {
    handleValidation,
    customValidators,
    sanitizeInput,
    commonValidations
};