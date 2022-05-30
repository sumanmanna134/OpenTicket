import { Publisher, Subjects, TicketUpdatedEvent } from '@offlix-org/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
