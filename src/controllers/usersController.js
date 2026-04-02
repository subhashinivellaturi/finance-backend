const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

function jsonResponse(success, data, message) {
  return { success, data, message };
}

exports.getUsers = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(jsonResponse(false, null, errors.array()));
  }
  const { role } = req.query;
  try {
    const users = await prisma.user.findMany({
      where: role ? { role } : {},
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(jsonResponse(true, users, 'Users fetched successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(jsonResponse(false, null, errors.array()));
  }
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json(jsonResponse(false, null, 'Email already registered'));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role }
    });
    res.status(201).json(jsonResponse(true, {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }, 'User created successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};

exports.toggleStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(jsonResponse(false, null, errors.array()));
  }
  const { id } = req.params;
  const { isActive } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive }
    });
    res.json(jsonResponse(true, {
      id: user.id,
      isActive: user.isActive
    }, 'User status updated successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};

exports.changeRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(jsonResponse(false, null, errors.array()));
  }
  const { id } = req.params;
  const { role } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });
    res.json(jsonResponse(true, {
      id: user.id,
      role: user.role
    }, 'User role updated successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};
