import request from 'supertest';
import { app } from '../../app';

import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
it('returns a 400 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'updateTitle',
      price: 20,
    })
    .expect(400);
});
it('returns a 401 if UnAuthenticated!', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'updateTitle',
      price: 20,
    })
    .expect(401);
});
