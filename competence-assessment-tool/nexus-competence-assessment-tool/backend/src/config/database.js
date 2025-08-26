// src/config/database.js
const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'nexus_cat_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Welcome123',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Test the connection
pool.on('connect', () => {
    logger.info('Database connected successfully');
});

pool.on('error', (err) => {
    logger.error('Database connection error:', err);
});

// Query helper function with logging
const query = async (text, params) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        logger.debug(`Executed query in ${duration}ms`, { text, params });
        return res;
    } catch (error) {
        logger.error('Database query error:', { text, params, error: error.message });
        throw error;
    }
};

// Test database connection function
const testConnection = async () => {
    try {
        const result = await pool.query('SELECT NOW()');
        logger.info('Database connection test successful:', result.rows[0]);
        return true;
    } catch (error) {
        logger.error('Database connection test failed:', error);
        throw error;
    }
};

module.exports = {
    pool,
    query,
    testConnection
};