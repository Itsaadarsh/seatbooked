import { Subjects, Emitter } from '@itsaadarsh/auth';
import { TICKETUPDATED } from '../../utils/interface.types';

export class TicketUpdatedEmitter extends Emitter<TICKETUPDATED> {
  readonly subject = Subjects.TicketUpdated;
}
