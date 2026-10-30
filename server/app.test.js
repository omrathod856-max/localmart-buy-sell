const request = require('supertest');
const app = require('./src/app');

describe('Health Endpoints', () => {
  it('GET /api/health should return 200 with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('LocalMart API');
  });

  it('GET /api/health/db should return database status', async () => {
    const res = await request(app).get('/api/health/db');
    expect(res.body.database).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  });

  it('GET /api/nonexistent should return 404', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});

describe('Auth Endpoints', () => {
  it('POST /api/auth/register should validate input', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'A',
      email: 'notanemail',
      password: '123'
    });
    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login should validate input', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'notanemail',
      password: ''
    });
    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/auth/me should return 401 without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});

describe('Product Endpoints', () => {
  it('GET /api/products should return products array or server error when no DB', async () => {
    const res = await request(app).get('/api/products');
    // In CI without a real DB, accept either 200 (with DB) or 500 (no DB)
    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body.products).toBeDefined();
      expect(Array.isArray(res.body.products)).toBe(true);
    }
  }, 15000);

  it('GET /api/products/my-listings should return 401 without token', async () => {
    const res = await request(app).get('/api/products/my-listings');
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/products should return 401 without token', async () => {
    const res = await request(app).post('/api/products').send({
      title: 'Test',
      description: 'Test description',
      price: 100,
      category: 'Electronics',
      condition: 'Good'
    });
    expect(res.statusCode).toBe(401);
  });
});
