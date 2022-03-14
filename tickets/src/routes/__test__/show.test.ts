import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticketSchema';
it('returns a 400 if the ticket is not found', async () => {
  await request(app)
    .get('/api/tickets/kkda')
    .set('Cookie', global.signin())
    .send()
    .expect(400);
});
it('returns a 200 if the ticket is found', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'NewTicket',
      price: 120,
      userId: '',
      device: '',
      ip: '',
    })
    .expect(201);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.ticketInfo.ticketId}`)
    .set('Cookie', global.signin())
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual('NewTicket');
});
