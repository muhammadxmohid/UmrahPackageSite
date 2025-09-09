const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../backend/server');
const User = require('../../backend/models/User');
const Package = require('../../backend/models/Package');

let server;
let adminToken;
let userToken;
let packageId;

beforeAll(async () => {
  server = app.listen(4001);
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/umrahhajj_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create admin user
  const admin = new User({ username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' });
  await admin.save();
  const adminLogin = await request(server).post('/api/users/login').send({ email: 'admin@example.com', password: 'admin123' });
  adminToken = adminLogin.body.token;

  // Create regular user
  const user = new User({ username: 'user', email: 'user@example.com', password: 'user123', role: 'user' });
  await user.save();
  const userLogin = await request(server).post('/api/users/login').send({ email: 'user@example.com', password: 'user123' });
  userToken = userLogin.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await Package.deleteMany({});
  await mongoose.connection.close();
  await server.close();
});

describe('Package Routes', () => {
  it('admin can create package', async () => {
    const res = await request(server)
      .post('/api/packages')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Package',
        description: 'Test description',
        price: 1000,
        durationDays: 7,
        itinerary: ['Day 1', 'Day 2'],
        images: ['https://example.com/image.jpg'],
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Package');
    packageId = res.body._id;
  });

  it('user cannot create package', async () => {
    const res = await request(server)
      .post('/api/packages')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Test Package 2',
        description: 'Test description 2',
        price: 1500,
        durationDays: 5,
        itinerary: ['Day 1', 'Day 2'],
      });
    expect(res.statusCode).toBe(403);
  });

  it('anyone can get all packages', async () => {
    const res = await request(server).get('/api/packages');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('anyone can get package by id', async () => {
    const res = await request(server).get(`/api/packages/${packageId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(packageId);
  });

  it('admin can update package', async () => {
    const res = await request(server)
      .put(`/api/packages/${packageId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 1200 });
    expect(res.statusCode).toBe(200);
    expect(res.body.price).toBe(1200);
  });

  it('user cannot update package', async () => {
    const res = await request(server)
      .put(`/api/packages/${packageId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 1300 });
    expect(res.statusCode).toBe(403);
  });

  it('admin can delete package', async () => {
    const res = await request(server)
      .delete(`/api/packages/${packageId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });

  it('user cannot delete package', async () => {
    const res = await request(server)
      .delete(`/api/packages/${packageId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });
});
