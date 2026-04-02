const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function jsonResponse(success, data, message) {
  return { success, data, message };
}

exports.summary = async (req, res) => {
  try {
    const [income, expenses, totalRecords] = await Promise.all([
      prisma.financialRecord.aggregate({
        _sum: { amount: true },
        where: { type: 'INCOME', isDeleted: false }
      }),
      prisma.financialRecord.aggregate({
        _sum: { amount: true },
        where: { type: 'EXPENSE', isDeleted: false }
      }),
      prisma.financialRecord.count({ where: { isDeleted: false } })
    ]);
    const totalIncome = income._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;
    res.json(jsonResponse(true, {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      totalRecords
    }, 'Summary fetched successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};

exports.byCategory = async (req, res) => {
  try {
    const grouped = await prisma.financialRecord.groupBy({
      by: ['category'],
      where: { isDeleted: false },
      _sum: { amount: true },
      _count: { _all: true }
    });
    const result = grouped.map(g => ({
      category: g.category,
      totalAmount: g._sum.amount || 0,
      count: g._count._all
    }));
    res.json(jsonResponse(true, result, 'By-category summary fetched successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};

exports.trends = async (req, res) => {
  const year = parseInt(req.query.year) || new Date().getFullYear();
  try {
    const records = await prisma.financialRecord.findMany({
      where: {
        isDeleted: false,
        date: {
          gte: new Date(`${year}-01-01T00:00:00.000Z`),
          lte: new Date(`${year}-12-31T23:59:59.999Z`)
        }
      },
      select: { amount: true, type: true, date: true }
    });
    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalIncome: 0,
      totalExpenses: 0,
      net: 0
    }));
    records.forEach(r => {
      const m = new Date(r.date).getMonth();
      if (r.type === 'INCOME') monthly[m].totalIncome += r.amount;
      if (r.type === 'EXPENSE') monthly[m].totalExpenses += r.amount;
    });
    monthly.forEach(m => { m.net = m.totalIncome - m.totalExpenses; });
    res.json(jsonResponse(true, monthly, 'Trends fetched successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};

exports.recent = async (req, res) => {
  try {
    const records = await prisma.financialRecord.findMany({
      where: { isDeleted: false },
      orderBy: { date: 'desc' },
      take: 10
    });
    res.json(jsonResponse(true, records, 'Recent records fetched successfully'));
  } catch (err) {
    res.status(500).json(jsonResponse(false, null, err.message));
  }
};
