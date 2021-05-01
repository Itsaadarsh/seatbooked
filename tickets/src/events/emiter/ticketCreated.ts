import { Subjects, Emitter } from '@itsaadarsh/auth';
import { TICKETCREATED } from '../../utils/interface.types';

export class TicketCreatedEmitter extends Emitter<TICKETCREATED> {
  readonly subject = Subjects.TicketCreated;
}
