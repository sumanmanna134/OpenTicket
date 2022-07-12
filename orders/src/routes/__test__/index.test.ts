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
it('fetches order for an particular uer', async () => {
  //create three tickets
  const ticket1 = await buildTicket();
  const ticket2 = await buildTicket();
  const ticket3 = await buildTicket();

  const userOne = global.signin();
  const userTwo = global.signin();

  //create one order as user #1

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticket1.id })
    .expect(201);
  // create two order as user #2
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket2.id })
    .expect(201);
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticket3.id })
    .expect(201);

  //make request to get orders for user #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
});
