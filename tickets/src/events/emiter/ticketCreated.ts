import { Subjects, TICKETCREATED, Emitter } from '@itsaadarsh/auth';

export class TicketCreatedEmitter extends Emitter<TICKETCREATED> {
  readonly subject = Subjects.TicketCreated;
}
