import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
      email: 'manna.suman128@gmail.com',
      password: '12378',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
      email: 'manna.sum',
      password: '12378',
    })
    .expect(400);
});

it('returns a 400 with an invalid format password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
      email: 'manna.suman1342gmail.com',
      password: '123',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
      email: 'manna.suman128@gmail.com',
    })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
    })
    .expect(400);
});

it('disallow duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
      email: 'manna.suman134@gmail.com',
      password: '12378',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
      email: 'manna.suman134@gmail.com',
      password: '12378',
    })
    .expect(400);
});

it('sets a cookie on successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
      email: 'manna.suman134@gmail.com',
      password: '12378',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
