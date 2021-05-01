import { Emitter } from '@itsaadarsh/auth';
import { ORDERCANCELLED } from '../../utils/interface.types';

enum Subjects {
  TicketCreated = 'ticket:created',
  TicketUpdated = 'ticket:updated',
  OrderCreated = 'order:created',
  OrderCancelled = 'order:cancelled',
}

export class OrderCancelledEmitter extends Emitter<ORDERCANCELLED> {
  readonly subject = Subjects.OrderCancelled;
}
