const request = require('supertest');
const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, User, Category, Event } = require('./setup');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'testsecret';

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(403).json({ error: 'Forbidden' });
  }
};

// Protected Category route
app.post('/categories', authMiddleware, async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

// Protected Event route
app.post('/events', authMiddleware, async (req, res) => {
  const event = await Event.create({ ...req.body, created_by: req.user.userId });
  res.status(201).json(event);
});

// Generate token for testing
let testToken;
beforeAll(async () => {
  const user = await User.findOne({ where: { email: 'testuser@example.com' } });
  testToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
});

// Test Category creation
describe('Protected Endpoints', () => {
  test('should create a category with a valid token', async () => {
    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ name: 'Music' });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Music');
  });

  test('should reject category creation without token', async () => {
    const response = await request(app)
      .post('/categories')
      .send({ name: 'Sports' });

    expect(response.status).toBe(401);
  });

  test('should create an event with a valid token', async () => {
    const response = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        title: 'Tech Conference',
        description: 'A conference about technology.',
        location: { type: 'Point', coordinates: [-73.935242, 40.73061] },
        date: '2025-06-01',
        time: '10:00:00',
      });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Tech Conference');
  });

  test('should reject event creation without token', async () => {
    const response = await request(app)
      .post('/events')
      .send({
        title: 'Art Workshop',
        description: 'A workshop about painting.',
        location: { type: 'Point', coordinates: [-74.006, 40.7128] },
        date: '2025-07-01',
        time: '14:00:00',
      });

    expect(response.status).toBe(401);
  });
});
