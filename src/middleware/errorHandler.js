const { ValidationError } = require('express-validator');
const { Prisma } = require('@prisma/client');

module.exports = (err, req, res, next) => {
  let status = 500;
  let message = 'Internal server error';
  let errors = [];

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      status = 409;
      message = 'Unique constraint failed';
      errors = [{ field: err.meta.target, message: err.message }];
    } else if (err.code === 'P2025') {
      status = 404;
      message = 'Resource not found';
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  // express-validator errors
  if (err.array && typeof err.array === 'function') {
    status = 400;
    message = 'Validation error';
    errors = err.array();
  }

  // Custom error shape
  if (err.status) status = err.status;
  if (err.message) message = err.message;
  if (err.errors) errors = err.errors;

  res.status(status).json({ success: false, message, errors });
};
