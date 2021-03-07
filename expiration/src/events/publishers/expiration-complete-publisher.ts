import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent
} from '@rmltickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
