const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../backend/server'); // Adapted to export app from server.js
const User = require('../../backend/models/User');

let server;

beforeAll(async () => {
  server = app.listen(4000);
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/umrahhajj_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  await server.close();
});

describe('User Routes', () => {
  const userData = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
  };

  it('should register a new user', async () => {
    const res = await request(server).post('/api/users/register').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(userData.email);
  });

  it('should not register user with existing email', async () => {
    const res = await request(server).post('/api/users/register').send(userData);
    expect(res.statusCode).toBe(409);
  });

  it('should login with correct credentials', async () => {
    const res = await request(server).post('/api/users/login').send({
      email: userData.email,
      password: userData.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    const res = await request(server).post('/api/users/login').send({
      email: userData.email,
      password: 'wrongpassword',
    });
    expect(res.statusCode).toBe(401);
  });

  it('should get profile when authenticated', async () => {
    const loginRes = await request(server).post('/api/users/login').send({
      email: userData.email,
      password: userData.password,
    });
    const token = loginRes.body.token;
    const res = await request(server)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(userData.email);
  });

  it('should not get profile without token', async () => {
    const res = await request(server).get('/api/users/profile');
    expect(res.statusCode).toBe(401);
  });
});
