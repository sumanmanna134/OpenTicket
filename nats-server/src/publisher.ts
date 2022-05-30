//publisher
import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';
console.clear();
const FakeTicket = {
  id: 'xyz',
  title: 'concert',
  price: 345,
};
const stan = nats.connect('openticket', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  try {
    console.log('Publisher connected to NATS');
    const publisher = new TicketCreatedPublisher(stan);
    await publisher.publish(FakeTicket);
  } catch (err) {
    console.error(err);
  }
});
