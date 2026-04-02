
const request = require('supertest');
const app = require('../src/app');

describe('Auth Routes', () => {
  test('POST /api/auth/register - valid data returns 201', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        role: 'VIEWER'
      });
    expect(res.statusCode).toBe(201);
  });

  test('POST /api/auth/register - missing fields returns 400', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/auth/login - valid credentials returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@finance.com', password: 'Admin@123' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /api/auth/login - wrong password returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@finance.com', password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });
});
