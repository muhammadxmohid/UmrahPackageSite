const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../backend/server');
const User = require('../../backend/models/User');
const Package = require('../../backend/models/Package');
const Inquiry = require('../../backend/models/Inquiry');

let server;
let adminToken;
let userToken;
let packageId;
let inquiryId;

beforeAll(async () => {
  server = app.listen(4002);
  await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/umrahhajj_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create admin user
  const admin = new User({ username: 'admin', email: 'admin2@example.com', password: 'admin123', role: 'admin' });
  await admin.save();
  const adminLogin = await request(server).post('/api/users/login').send({ email: 'admin2@example.com', password: 'admin123' });
  adminToken = adminLogin.body.token;

  // Create regular user
  const user = new User({ username: 'user', email: 'user2@example.com', password: 'user123', role: 'user' });
  await user.save();
  const userLogin = await request(server).post('/api/users/login').send({ email: 'user2@example.com', password: 'user123' });
  userToken = userLogin.body.token;

  // Create package
  const pkg = new Package({
    title: 'Inquiry Test Package',
    description: 'Description',
    price: 500,
    durationDays: 4,
    itinerary: ['Step 1', 'Step 2'],
    images: [],
  });
  await pkg.save();
  packageId = pkg._id.toString();
});

afterAll(async () => {
  await User.deleteMany({});
  await Package.deleteMany({});
  await Inquiry.deleteMany({});
  await mongoose.connection.close();
  await server.close();
});

describe('Inquiry Routes', () => {
  it('user can create inquiry', async () => {
    const res = await request(server)
      .post('/api/inquiries')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        phone: '1234567890',
        message: 'I want to know more',
        packageId,
      });
    expect(res.statusCode).toBe(201);
  });

  it('admin can get all inquiries', async () => {
    const res = await request(server)
      .get('/api/inquiries')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) inquiryId = res.body[0]._id;
  });

  it('user cannot get inquiries list', async () => {
    const res = await request(server)
      .get('/api/inquiries')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('admin can delete inquiry', async () => {
    if (!inquiryId) return;
    const res = await request(server)
      .delete(`/api/inquiries/${inquiryId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
