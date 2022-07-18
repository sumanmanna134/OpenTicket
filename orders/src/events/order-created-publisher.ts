import { OrderCreatedEvent, Publisher, Subjects } from '@offlix-org/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
