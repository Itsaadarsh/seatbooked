import { Subjects, ORDERCREATED, Emitter } from '@itsaadarsh/auth';

export class OrderCreatedEmitter extends Emitter<ORDERCREATED> {
  readonly subject = Subjects.OrderCreated;
}
