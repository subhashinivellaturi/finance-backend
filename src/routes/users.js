
const express = require('express');
const { body, param, query } = require('express-validator');
const router = express.Router();
const usersController = require('../controllers/usersController');
const { verifyToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (ADMIN only)
 */

router.use(verifyToken, authorizeRoles('ADMIN'));

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [VIEWER, ANALYST, ADMIN]
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 */
router.get(
  '/',
  [query('role').optional().isIn(['VIEWER', 'ANALYST', 'ADMIN'])],
  usersController.getUsers
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Smith
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [VIEWER, ANALYST, ADMIN]
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Access denied
 */
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['VIEWER', 'ANALYST', 'ADMIN']).withMessage('Invalid role')
  ],
  usersController.createUser
);

/**
 * @swagger
 * /api/users/{id}/status:
 *   patch:
 *     summary: Toggle user active status (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Status updated
 *       403:
 *         description: Access denied
 */
router.patch(
  '/:id/status',
  [
    param('id').isUUID().withMessage('Invalid user ID'),
    body('isActive').isBoolean().withMessage('isActive must be boolean')
  ],
  usersController.toggleStatus
);

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Change user role (ADMIN only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [VIEWER, ANALYST, ADMIN]
 *                 example: ANALYST
 *     responses:
 *       200:
 *         description: Role updated
 *       403:
 *         description: Access denied
 */
router.patch(
  '/:id/role',
  [
    param('id').isUUID().withMessage('Invalid user ID'),
    body('role').isIn(['VIEWER', 'ANALYST', 'ADMIN']).withMessage('Invalid role')
  ],
  usersController.changeRole
);

module.exports = router;
