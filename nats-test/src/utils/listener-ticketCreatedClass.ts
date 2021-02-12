import { Message } from 'node-nats-streaming';
import { Listener } from '@itsaadarsh/auth';
import { Subjects, TICKETCREATED } from '@itsaadarsh/auth';

export class TicketCreatedListener extends Listener<TICKETCREATED> {
  readonly subject = Subjects.TicketCreated;
  queueGrpName = 'payments-service';

  onMessage(data: TICKETCREATED['data'], msg: Message) {
    console.log(msg.getSequence(), data);
    msg.ack();
  }
}
