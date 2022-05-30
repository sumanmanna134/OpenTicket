import { Message } from 'node-nats-streaming';
import { Listener } from '../../../common/src/events/base-listener';
import { Subjects } from '@offlix-org/common';
import { TicketCreatedEvents } from '@offlix-org/common';
export class TicketCreatedListener extends Listener<TicketCreatedEvents> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = 'payment-service';

  onMessage(data: TicketCreatedEvents['data'], msg: Message): void {
    console.log('Event Data!', data);
    msg.ack();
  }
}
