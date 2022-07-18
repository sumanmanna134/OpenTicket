import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@offlix-org/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
