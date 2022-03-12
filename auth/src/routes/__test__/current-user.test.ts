import { Router } from 'express';
import request from 'supertest';
import { app } from '../../app';

it('responds with details about current user', async () => {
  const cookie = await global.signup();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)

    .send()
    .expect(200);
  console.log(response.body);
});

it('400 returns when non authenticated user', async () => {
  //   const cookie = await global.signup();

  const response = await request(app)
    .get('/api/users/currentuser')

    .send()
    .expect(401);
  console.log(response.body);
});
