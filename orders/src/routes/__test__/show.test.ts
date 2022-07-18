import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert1',
    price: 342.0,
  });

  await ticket.save();
  return ticket;
};
it('fetches the order', async () => {
  //create a ticket
  const ticket1 = await buildTicket();

  const userOne = global.signin();

  //make request to build order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket1.id })
    .expect(201);

  //make request to fetch the order

  const { body: fetchtedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userOne)
    .send()
    .expect(200);
  expect(fetchtedOrder.id).toEqual(order.id);
});

it('returns a error if one user trying to fetch some other order of some user', async () => {
  //create a ticket
  const ticket1 = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  //make request to build order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket1.id })
    .expect(201);

  //make request to fetch the order

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', userTwo)
    .send()
    .expect(400);
});
