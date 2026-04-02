
const express = require('express');
const { body, query, param } = require('express-validator');
const router = express.Router();
const recordsController = require('../controllers/recordsController');
const { verifyToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

/**
 * @swagger
 * tags:
 *   name: Records
 *   description: Financial records management
 */

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create a new financial record (ADMIN, ANALYST only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, type, category, date]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *                 example: INCOME
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               notes:
 *                 type: string
 *                 example: Monthly salary
 *     responses:
 *       201:
 *         description: Record created successfully
 *       403:
 *         description: Access denied
 */
router.post(
  '/',
  verifyToken,
  authorizeRoles('ADMIN', 'ANALYST'),
  [
    body('amount').isFloat().withMessage('Amount must be a number'),
    body('type').isIn(['INCOME', 'EXPENSE']).withMessage('Type must be INCOME or EXPENSE'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').isISO8601().withMessage('Date must be valid'),
    body('notes').optional().isString()
  ],
  recordsController.createRecord
);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records with filters
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [INCOME, EXPENSE]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         example: 2024-01-01
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         example: 2024-12-31
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         example: 10
 *     responses:
 *       200:
 *         description: List of records
 */
router.get(
  '/',
  verifyToken,
  [
    query('type').optional().isIn(['INCOME', 'EXPENSE']),
    query('category').optional().isString(),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1 })
  ],
  recordsController.getRecords
);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update a financial record (ADMIN only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Record not found
 */
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  [
    param('id').isUUID().withMessage('Invalid record ID'),
    body('amount').optional().isFloat(),
    body('type').optional().isIn(['INCOME', 'EXPENSE']),
    body('category').optional().isString(),
    body('date').optional().isISO8601(),
    body('notes').optional().isString()
  ],
  recordsController.updateRecord
);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Soft delete a financial record (ADMIN only)
 *     tags: [Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: Record not found
 */
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN'),
  [param('id').isUUID().withMessage('Invalid record ID')],
  recordsController.deleteRecord
);

module.exports = router;
