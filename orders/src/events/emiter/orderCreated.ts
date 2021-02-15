import { Emitter } from '@itsaadarsh/auth';
import { ORDERCREATED } from '../../utils/interface.types';

enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',
  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',
}

export class OrderCreatedEmitter extends Emitter<ORDERCREATED> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
