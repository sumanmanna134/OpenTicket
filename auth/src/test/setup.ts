import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
let mongo: any;

declare global {
  var signup: () => Promise<string[]>;
}

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let i = 0; i < collections.length; i++) {
    await collections[i].deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = async () => {
  const email = 'manna.suman134@gmail.com';
  const password = '12378';
  const resp = await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
      email: 'manna.suman134@gmail.com',
      password: '12378',
    })
    .expect(201);
  const cookie = resp.get('Set-Cookie');
  return cookie;
};
