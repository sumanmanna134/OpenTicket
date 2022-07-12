import request from 'supertest';
import { app } from '../../app';

import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticketSchema';
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

it('rejects update if ticket is reserved', async () => {
  const cookie = global.signin();
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'ticket-op',
      price: 20,
    });

  const ticket = await Ticket.findById({
    _id: response.body.ticketInfo.ticketId,
  });
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new Ticket',
      price: 100,
    })
    .expect(400);
});
