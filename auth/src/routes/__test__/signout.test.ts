import { Router } from 'express';
import request from 'supertest';
import { app } from '../../app';

it('200 if user successfully signout', async () => {
  const resp = await request(app)
    .post('/api/users/signup')
    .send({
      name: 'Suman Chandra Manna',
      phone: '7001671481',
      email: 'manna.suman134@gmail.com',
      password: '12378',
    })
    .expect(201);

  const response = await request(app)
    .post('/api/users/signout')
    .set('Cookie', resp.get('Set-Cookie'))

    .send()
    .expect(200);

  console.log(response.body);
});
