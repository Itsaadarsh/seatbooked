import { Emitter } from './emit-abstractClass';
import { Subjects, TICKETCREATED } from './listener.types';

export class TicketCreatedEmitter extends Emitter<TICKETCREATED> {
  readonly subject = Subjects.TicketCreated;
}
