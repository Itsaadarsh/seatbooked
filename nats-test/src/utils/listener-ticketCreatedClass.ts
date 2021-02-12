import { Message } from 'node-nats-streaming';
import { Listener } from './listener-abstractClass';
import { Subjects, TICKETCREATED } from './listener.types';

export class TicketCreatedListener extends Listener<TICKETCREATED> {
  readonly subject = Subjects.TicketCreated;
  queueGrpName = 'payments-service';

  onMessage(data: TICKETCREATED['data'], msg: Message) {
    console.log(msg.getSequence(), data);
    msg.ack();
  }
}
