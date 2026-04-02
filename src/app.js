
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const setupSwagger = require('./swagger');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const recordsRoutes = require('./routes/records');
const dashboardRoutes = require('./routes/dashboard');
const usersRoutes = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' }
});

app.use(globalLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

setupSwagger(app);

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/records', recordsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', usersRoutes);

app.use(errorHandler);

module.exports = app;
