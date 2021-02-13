import { Subjects, ORDERCANCELLED, Emitter } from '@itsaadarsh/auth';

export class OrderCancelledEmitter extends Emitter<ORDERCANCELLED> {
  readonly subject = Subjects.OrderCancelled;
}
