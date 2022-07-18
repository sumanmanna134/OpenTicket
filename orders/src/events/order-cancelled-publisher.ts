import { OrderCancelledEvent, Publisher, Subjects } from '@offlix-org/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
