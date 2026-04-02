
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard summary and analytics
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get total income, expenses and net balance
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary data
 */
router.get('/summary', verifyToken, dashboardController.summary);

/**
 * @swagger
 * /api/dashboard/by-category:
 *   get:
 *     summary: Get totals grouped by category
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Category wise totals
 */
router.get('/by-category', verifyToken, dashboardController.byCategory);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly income and expense trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         example: 2024
 *     responses:
 *       200:
 *         description: Monthly trends data
 */
router.get('/trends', verifyToken, dashboardController.trends);

/**
 * @swagger
 * /api/dashboard/recent:
 *   get:
 *     summary: Get 10 most recent financial records
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recent records
 */
router.get('/recent', verifyToken, dashboardController.recent);

module.exports = router;
