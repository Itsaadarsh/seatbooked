import { Listener, Subjects, TICKETCREATED } from '@itsaadarsh/auth';
import { Message } from 'node-nats-streaming';
import ticketModel from '../../models/tickets';

export class TicketCreatedListener extends Listener<TICKETCREATED> {
  readonly subject = Subjects.TicketCreated;
  queueGrpName = 'order-service';
  async onMessage(data: TICKETCREATED['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = ticketModel.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
