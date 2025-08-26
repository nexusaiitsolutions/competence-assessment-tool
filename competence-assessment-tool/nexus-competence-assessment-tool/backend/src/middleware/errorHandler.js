const logger = require('../utils/logger');

/**
 * Custom Error Class
 */
class AppError extends Error {
    constructor(message, statusCode, isOperational = true) {
        super(message);
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = isOperational;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation Error Handler
 */
const handleValidationError = (err) => {
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => e.message);
        return new AppError(`Validation Error: ${errors.join('. ')}`, 400);
    }
    return err;
};

/**
 * Database Error Handler
 */
const handleDatabaseError = (err) => {
    // PostgreSQL unique violation
    if (err.code === '23505') {
        const field = err.detail?.match(/Key \((.+?)\)/)?.[1] || 'field';
        return new AppError(`${field} already exists`, 409);
    }
    
    // PostgreSQL foreign key violation
    if (err.code === '23503') {
        const field = err.detail?.match(/Key \((.+?)\)/)?.[1] || 'reference';
        return new AppError(`Invalid ${field} reference`, 400);
    }
    
    // PostgreSQL not-null violation
    if (err.code === '23502') {
        const field = err.column || 'field';
        return new AppError(`${field} is required`, 400);
    }
    
    // PostgreSQL check constraint violation
    if (err.code === '23514') {
        return new AppError('Data validation failed', 400);
    }
    
    // PostgreSQL connection error
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        return new AppError('Database connection failed', 503);
    }
    
    return err;
};

/**
 * JWT Error Handler
 */
const handleJWTError = (err) => {
    if (err.name === 'JsonWebTokenError') {
        return new AppError('Invalid token', 401);
    }
    
    if (err.name === 'TokenExpiredError') {
        return new AppError('Token expired', 401);
    }
    
    return err;
};

/**
 * Cast Error Handler (for invalid IDs)
 */
const handleCastError = (err) => {
    if (err.name === 'CastError') {
        return new AppError('Invalid ID format', 400);
    }
    return err;
};

/**
 * Send Error Response for Development
 */
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    });
};

/**
 * Send Error Response for Production
 */
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            timestamp: new Date().toISOString()
        });
    } else {
        // Programming or other unknown error: don't leak error details
        logger.error('ERROR:', err);
        
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
            timestamp: new Date().toISOString()
        });
    }
};

/**
 * Global Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'error';

    // Log error details
    logger.error('Error Handler:', {
        message: error.message,
        statusCode: error.statusCode,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        userId: req.user?.id,
        body: req.method !== 'GET' ? req.body : undefined,
        query: req.query,
        timestamp: new Date().toISOString()
    });

    // Handle different error types
    error = handleValidationError(error);
    error = handleDatabaseError(error);
    error = handleJWTError(error);
    error = handleCastError(error);

    // Send error response based on environment
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, res);
    } else {
        sendErrorProd(error, res);
    }
};

/**
 * Async Error Handler Wrapper
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Handle Unhandled Routes
 */
const handleNotFound = (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
};

/**
 * Handle Unhandled Promise Rejections
 */
const handleUnhandledRejection = () => {
    process.on('unhandledRejection', (err, promise) => {
        logger.error('UNHANDLED PROMISE REJECTION! 💥 Shutting down...', {
            error: err.message,
            stack: err.stack,
            promise
        });
        
        // Close server gracefully
        process.exit(1);
    });
};

/**
 * Handle Uncaught Exceptions
 */
const handleUncaughtException = () => {
    process.on('uncaughtException', (err) => {
        logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', {
            error: err.message,
            stack: err.stack
        });
        
        process.exit(1);
    });
};

module.exports = {
    AppError,
    errorHandler,
    asyncHandler,
    handleNotFound,
    handleUnhandledRejection,
    handleUncaughtException
};