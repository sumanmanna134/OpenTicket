import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@offlix-org/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticketSchema';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { QueueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = QueueGroupName;
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    //find the ticket
    const ticket = await Ticket.findById(data.ticket.id);
    //if no ticket throw error
    if (!ticket) {
      throw new Error('Ticket not found!');
    }

    ticket.set({ orderId: undefined });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.ticket,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
    msg.ack();
  }
}
