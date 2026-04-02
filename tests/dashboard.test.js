
const request = require('supertest');
const app = require('../src/app');

let token;

beforeAll(async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'viewer@finance.com', password: 'Viewer@123' });
  token = res.body.token;
});

describe('Dashboard Routes', () => {
  test('GET /api/dashboard/summary - returns totals', async () => {
    const res = await request(app)
      .get('/api/dashboard/summary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('totalIncome');
    expect(res.body.data).toHaveProperty('totalExpenses');
    expect(res.body.data).toHaveProperty('netBalance');
  });

  test('GET /api/dashboard/by-category - returns categories', async () => {
    const res = await request(app)
      .get('/api/dashboard/by-category')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/dashboard/trends - returns monthly data', async () => {
    const res = await request(app)
      .get('/api/dashboard/trends?year=2024')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/dashboard/recent - returns recent records', async () => {
    const res = await request(app)
      .get('/api/dashboard/recent')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/dashboard/summary - without token returns 401', async () => {
    const res = await request(app).get('/api/dashboard/summary');
    expect(res.statusCode).toBe(401);
  });
});
