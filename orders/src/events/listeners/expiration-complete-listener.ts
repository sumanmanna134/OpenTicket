import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from '@offlix-org/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: ExpirationCompleteEvent['data'],
    msg: Message
  ): Promise<void> {
    const orderDetails = await Order.findById(data.orderId).populate('ticket');
    if (!orderDetails) {
      throw new Error('order not found!');
    }
    orderDetails.set({
      status: OrderStatus.Cancelled,
    });

    await orderDetails.save();
    new OrderCancelledPublisher(this.client).publish({
      id: orderDetails.id,
      version: orderDetails.version,
      ticket: {
        id: orderDetails.ticket.id,
      },
      status: OrderStatus.Cancelled,
    });
    msg.ack();
  }
}
