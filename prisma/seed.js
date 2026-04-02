const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Seed users
  const users = [
    { name: 'Admin', email: 'admin@finance.com', password: 'Admin@123', role: 'ADMIN' },
    { name: 'Analyst', email: 'analyst@finance.com', password: 'Analyst@123', role: 'ANALYST' },
    { name: 'Viewer', email: 'viewer@finance.com', password: 'Viewer@123', role: 'VIEWER' },
  ];
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, password: hashed, role: u.role },
    });
  }

  // Get admin id for createdBy
  const admin = await prisma.user.findUnique({ where: { email: 'admin@finance.com' } });

  // Seed financial records
  const records = [
    { amount: 5000, type: 'INCOME', category: 'salary', date: new Date('2024-01-10'), notes: 'January salary' },
    { amount: 200, type: 'EXPENSE', category: 'groceries', date: new Date('2024-01-12'), notes: 'Groceries' },
    { amount: 150, type: 'EXPENSE', category: 'utilities', date: new Date('2024-01-15'), notes: 'Electricity bill' },
    { amount: 1000, type: 'INCOME', category: 'freelance', date: new Date('2024-02-05'), notes: 'Freelance project' },
    { amount: 300, type: 'EXPENSE', category: 'rent', date: new Date('2024-02-01'), notes: 'February rent' },
    { amount: 4500, type: 'INCOME', category: 'salary', date: new Date('2024-02-10'), notes: 'February salary' },
    { amount: 250, type: 'EXPENSE', category: 'entertainment', date: new Date('2024-03-03'), notes: 'Movies' },
    { amount: 120, type: 'EXPENSE', category: 'transport', date: new Date('2024-03-10'), notes: 'Bus pass' },
    { amount: 600, type: 'INCOME', category: 'bonus', date: new Date('2024-03-15'), notes: 'Quarterly bonus' },
    { amount: 180, type: 'EXPENSE', category: 'groceries', date: new Date('2024-03-20'), notes: 'Groceries' },
  ];
  for (const r of records) {
    await prisma.financialRecord.create({
      data: { ...r, createdById: admin.id },
    });
  }
}

main()
  .then(() => {
    console.log('Seeding complete');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
