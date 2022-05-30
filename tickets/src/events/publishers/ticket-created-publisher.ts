import { Publisher, Subjects, TicketCreatedEvents } from '@offlix-org/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvents> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
