import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { natsWrapper } from '../__mocks__/nats-wrapper';

let mongo: any;

declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper');
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = new MongoMemoryServer();
  await mongo.start();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let i = 0; i < collections.length; i++) {
    await collections[i].deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = () => {
  //build a JWT payload
  const payload = {
    email: 'manna.suman134@gmail.com',
    password: '1234',
  };
  //create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //build session Object.
  const session = { jwt: token };
  //turn that session in to json
  const sessionJson = JSON.stringify(session);
  //take JSON and encode it as base64
  const base64 = Buffer.from(sessionJson).toString('base64');
  return [`session=${base64}`];

  //
  // const email = 'manna.suman134@gmail.com';
  // const password = '12378';
  // const resp = await request(app)
  //   .post('/api/users/signup')
  //   .send({
  //     name: 'Suman Chandra Manna',
  //     phone: '7001671481',
  //     email: 'manna.suman134@gmail.com',
  //     password: '12378',
  //   })
  //   .expect(201);
  // const cookie = resp.get('Set-Cookie');
  // return cookie;
};
