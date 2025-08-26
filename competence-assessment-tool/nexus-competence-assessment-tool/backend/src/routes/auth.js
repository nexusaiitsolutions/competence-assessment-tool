const express = require('express');
const { body } = require('express-validator');
const { 
    login, 
    resetPassword, 
    changePassword, 
    logout, 
    verifyToken 
} = require('../controllers/authController');
const { authenticateToken, authorize } = require('../middleware/auth');
const { handleValidation, commonValidations } = require('../utils/validation');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post('/login', [
    ...commonValidations.email,
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 1 })
        .withMessage('Password cannot be empty')
], handleValidation, login);

/**
 * @route   POST /api/auth/reset/:userId
 * @desc    Reset user password (admin/HR only)
 * @access  Private (admin/hr)
 */
router.post('/reset/:userId', 
    authenticateToken, 
    authorize(['admin', 'hr']),
    [
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters long')
            .isLength({ max: 128 })
            .withMessage('Password too long')
    ], 
    handleValidation, 
    resetPassword
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change own password
 * @access  Private
 */
router.post('/change-password',
    authenticateToken,
    [
        body('currentPassword')
            .notEmpty()
            .withMessage('Current password is required'),
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters long')
            .isLength({ max: 128 })
            .withMessage('Password too long')
    ],
    handleValidation,
    changePassword
);

/**
 * @route   POST /api/auth/logout
 * @desc    User logout
 * @access  Private
 */
router.post('/logout', authenticateToken, logout);

/**
 * @route   GET /api/auth/verify
 * @desc    Verify token validity
 * @access  Private
 */
router.get('/verify', authenticateToken, verifyToken);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info (alias for /api/users/me)
 * @access  Private
 */
router.get('/me', authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;