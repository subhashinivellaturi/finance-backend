
const request = require('supertest');
const app = require('../src/app');

let adminToken;
let viewerToken;

beforeAll(async () => {
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@finance.com', password: 'Admin@123' });
  adminToken = adminRes.body.token;

  const viewerRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'viewer@finance.com', password: 'Viewer@123' });
  viewerToken = viewerRes.body.token;
});

describe('Records Routes', () => {
  test('GET /api/records - without token returns 401', async () => {
    const res = await request(app).get('/api/records');
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/records - with token returns 200', async () => {
    const res = await request(app)
      .get('/api/records')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('GET /api/records - with search filter returns 200', async () => {
    const res = await request(app)
      .get('/api/records?search=salary')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('POST /api/records - admin can create record', async () => {
    const res = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        amount: 5000,
        type: 'INCOME',
        category: 'Salary',
        date: '2024-01-15',
        notes: 'Monthly salary'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/records - viewer gets 403', async () => {
    const res = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${viewerToken}`)
      .send({
        amount: 1000,
        type: 'EXPENSE',
        category: 'Food',
        date: '2024-01-15'
      });
    expect(res.statusCode).toBe(403);
  });

  test('GET /api/records - filter by type returns 200', async () => {
    const res = await request(app)
      .get('/api/records?type=INCOME')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
