import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticketSchema';
const createTicket = () => {
  return request(app).post('/api/tickets').set('Cookie', global.signin()).send({
    title: 'NewTicket',
    price: 120,
    userId: '',
    device: '',
    ip: '',
  });
};
it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();
  const response = await request(app)
    .get('/api/tickets')
    .set('Cookie', global.signin())
    .expect(200);

  expect(response.body.tickets.length).toEqual(3);
});
