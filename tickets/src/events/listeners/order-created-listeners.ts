import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@offlix-org/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticketSchema';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { QueueGroupName } from './queue-group-name';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = QueueGroupName;
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    //Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    //If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found!');
    }

    //Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    //save the ticket
    await ticket.save();
    new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    msg.ack();
  }
}
