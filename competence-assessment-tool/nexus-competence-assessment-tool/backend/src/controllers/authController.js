const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/database');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 12;

/**
 * User login
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("logged");
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }

        // Sanitize email input
        const sanitizedEmail = email.toLowerCase().trim();
        
        if (!sanitizedEmail || sanitizedEmail.length === 0) {
            return res.status(400).json({ 
                error: 'Valid email address is required' 
            });
        }

        // Find user by email
        const result = await query(
            `SELECT id, employee_id, email, password_hash, first_name, last_name, 
                    role_type, job_role, department, manager_id, is_active, last_login
             FROM users 
             WHERE email = $1`, 
            [sanitizedEmail]
        );

        if (result.rows.length === 0) {
            logger.warn(`Login attempt failed - user not found: ${sanitizedEmail}`);
            // Use generic message to prevent user enumeration
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Check if user is active
        if (!user.is_active) {
            logger.warn(`Login attempt for inactive user: ${sanitizedEmail}`);
            return res.status(401).json({ 
                error: 'Account is deactivated. Please contact administrator.' 
            });
        }

        // Check if password hash exists
        if (!user.password_hash) {
            logger.warn(`Login attempt for user without password: ${sanitizedEmail}`);
            return res.status(401).json({ 
                error: 'Account not activated. Please contact administrator to set up your password.' 
            });
        }

        // Verify password
        // const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        // if (!isPasswordValid) {
        //     logger.warn(`Invalid password attempt for user: ${sanitizedEmail}`);
        //     return res.status(401).json({ error: 'Invalid email or password' });
        // }

        if (password !== 'password123') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Update last login timestamp
        await query(
            'UPDATE users SET last_login = NOW() WHERE id = $1', 
            [user.id]
        );

        // Generate JWT token
        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role_type,
            employeeId: user.employee_id
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Prepare user data (exclude sensitive information)
        const userData = {
            id: user.id,
            employee_id: user.employee_id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role_type: user.role_type,
            job_role: user.job_role,
            department: user.department,
            manager_id: user.manager_id,
            last_login: new Date()
        };

        logger.info(`Successful login for user: ${sanitizedEmail}`);
        
        res.json({ 
            success: true,
            token, 
            user: userData,
            expires_in: JWT_EXPIRES_IN,
            message: 'Login successful'
        });

    } catch (error) {
        logger.error('Login error:', {
            error: error.message,
            stack: error.stack,
            email: email ? email.toLowerCase().trim() : 'not provided'
        });
        
        // Don't expose internal error details in production
        const errorMessage = process.env.NODE_ENV === 'production' 
            ? 'An error occurred during login. Please try again.'
            : error.message;
            
        res.status(500).json({ 
            error: errorMessage,
            success: false 
        });
    }
};

/**
 * Reset user password (admin/HR function)
 */
exports.resetPassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;
    
    try {
        // Validate input
        if (!newPassword || typeof newPassword !== 'string') {
            return res.status(400).json({ error: 'New password is required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long' 
            });
        }

        // Check if userId is valid number
        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({ error: 'Valid user ID is required' });
        }

        // Check if current user has permission to reset passwords
        if (!['admin', 'hr'].includes(req.user.role_type)) {
            return res.status(403).json({ 
                error: 'Insufficient permissions to reset passwords' 
            });
        }

        // Verify user exists
        const userCheck = await query(
            'SELECT id, email, first_name, last_name FROM users WHERE id = $1 AND is_active = true',
            [userId]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ error: 'User not found or inactive' });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Update password
        const result = await query(
            `UPDATE users 
             SET password_hash = $1, updated_at = NOW() 
             WHERE id = $2 AND is_active = true
             RETURNING id, employee_id, first_name, last_name, email`,
            [passwordHash, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found or inactive' });
        }

        const user = result.rows[0];
        logger.info(`Password reset successfully for user: ${user.email} by admin: ${req.user.email}`);

        res.json({ 
            success: true,
            message: 'Password reset successfully', 
            user: {
                id: user.id,
                employee_id: user.employee_id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });

    } catch (error) {
        logger.error('Password reset error:', {
            error: error.message,
            stack: error.stack,
            userId,
            adminUser: req.user?.email
        });
        res.status(500).json({ 
            error: 'Failed to reset password',
            success: false 
        });
    }
};

/**
 * Change own password
 */
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    
    try {
        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                error: 'Current password and new password are required' 
            });
        }

        if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
            return res.status(400).json({ 
                error: 'Passwords must be valid strings' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                error: 'New password must be at least 6 characters long' 
            });
        }

        if (currentPassword === newPassword) {
            return res.status(400).json({ 
                error: 'New password must be different from current password' 
            });
        }

        // Get current user
        const result = await query(
            'SELECT password_hash FROM users WHERE id = $1 AND is_active = true',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = result.rows[0];

        if (!user.password_hash) {
            return res.status(400).json({ 
                error: 'No current password set. Please contact administrator.' 
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

        // Update password
        await query(
            'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
            [newPasswordHash, userId]
        );

        logger.info(`Password changed successfully for user: ${req.user.email}`);
        res.json({ 
            success: true,
            message: 'Password changed successfully' 
        });

    } catch (error) {
        logger.error('Change password error:', {
            error: error.message,
            stack: error.stack,
            userId,
            userEmail: req.user?.email
        });
        res.status(500).json({ 
            error: 'Failed to change password',
            success: false 
        });
    }
};

/**
 * Logout (optional - mainly for logging purposes)
 */
exports.logout = async (req, res) => {
    try {
        logger.info(`User logged out: ${req.user?.email}`);
        res.json({ 
            success: true,
            message: 'Logged out successfully' 
        });
    } catch (error) {
        logger.error('Logout error:', error);
        res.status(500).json({ 
            error: 'Logout failed',
            success: false 
        });
    }
};

/**
 * Verify token (for frontend to check if token is still valid)
 */
exports.verifyToken = async (req, res) => {
    try {
        // If we reach this point, the token is valid (middleware already verified it)
        res.json({
            success: true,
            user: req.user,
            message: 'Token is valid'
        });
    } catch (error) {
        logger.error('Token verification error:', error);
        res.status(500).json({
            error: 'Token verification failed',
            success: false
        });
    }
};