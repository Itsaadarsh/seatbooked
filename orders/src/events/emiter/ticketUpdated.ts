import { Subjects, TICKETUPDATED, Emitter } from '@itsaadarsh/auth';

export class TicketUpdatedEmitter extends Emitter<TICKETUPDATED> {
  readonly subject = Subjects.TicketUpdated;
}
