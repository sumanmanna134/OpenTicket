import { Publisher } from '@offlix-org/common';
import { Subjects } from '@offlix-org/common';

import { TicketCreatedEvents } from '@offlix-org/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvents> {
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
