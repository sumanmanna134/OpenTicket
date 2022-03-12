import request from 'supertest';
import { app } from '../../app';

it('fails when a email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({ email: 'manna.suman128@gmail.com', password: '12378' })
    .expect(400);
});

it('fails when a incorrect password is supplied', async () => {
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
    .post('/api/users/signin')
    .send({ email: 'manna.suman134@gmail.com', password: '1237' })
    .expect(400);
});

it('fails when a incorrect email is supplied', async () => {
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
    .post('/api/users/signin')
    .send({ email: 'manna.suman135@gmail.com', password: '12378' })
    .expect(400);
});

it('success when successful login', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
      email: 'manna.suman134@gmail.com',
      password: '12378',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signin')
    .send({ email: 'manna.suman134@gmail.com', password: '12378' })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
