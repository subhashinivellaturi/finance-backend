
const { PrismaClient } = require('@prisma/client');
const { validationResult } = require('express-validator');
const prisma = new PrismaClient();

function jsonResponse(success, data, message) {
  return { success, data, message };
}

exports.createRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(jsonResponse(false, null, errors.array()));
  }
  const { amount, type, category, date, notes } = req.body;
  if (parseFloat(amount) <= 0) {
    return res.status(400).json(jsonResponse(false, null, 'Amount must be greater than 0'));
  }
  try {
    const record = await prisma.financialRecord.create({
      data: {
        amount: parseFloat(amount),
        type,
        category,
        date: new Date(date),
        notes,
        createdById: req.user.id
      }
    });
    res.status(201).json(jsonResponse(true, record, 'Record created successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};

exports.getRecords = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(jsonResponse(false, null, errors.array()));
  }
  const { type, category, from, to, page = 1, limit = 10, search } = req.query;
  const filters = { isDeleted: false };
  if (type) filters.type = type;
  if (category) filters.category = { contains: category, mode: 'insensitive' };
  if (from || to) filters.date = {};
  if (from) filters.date.gte = new Date(from);
  if (to) filters.date.lte = new Date(to);
  if (search) {
    filters.OR = [
      { category: { contains: search, mode: 'insensitive' } },
      { notes: { contains: search, mode: 'insensitive' } }
    ];
  }
  try {
    const total = await prisma.financialRecord.count({ where: filters });
    const records = await prisma.financialRecord.findMany({
      where: filters,
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
      orderBy: { date: 'desc' }
    });
    res.json(jsonResponse(true, { records, total, page: parseInt(page), limit: parseInt(limit) }, 'Records fetched successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};

exports.updateRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(jsonResponse(false, null, errors.array()));
  }
  const { id } = req.params;
  const { amount, type, category, date, notes } = req.body;
  if (amount !== undefined && parseFloat(amount) <= 0) {
    return res.status(400).json(jsonResponse(false, null, 'Amount must be greater than 0'));
  }
  try {
    const existing = await prisma.financialRecord.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      return res.status(404).json(jsonResponse(false, null, 'Record not found'));
    }
    const record = await prisma.financialRecord.update({
      where: { id },
      data: {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(type && { type }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
        ...(notes !== undefined && { notes })
      }
    });
    res.json(jsonResponse(true, record, 'Record updated successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};

exports.deleteRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(jsonResponse(false, null, errors.array()));
  }
  const { id } = req.params;
  try {
    const existing = await prisma.financialRecord.findFirst({ where: { id, isDeleted: false } });
    if (!existing) {
      return res.status(404).json(jsonResponse(false, null, 'Record not found'));
    }
    const record = await prisma.financialRecord.update({
      where: { id },
      data: { isDeleted: true }
    });
    res.json(jsonResponse(true, record, 'Record soft-deleted successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};
