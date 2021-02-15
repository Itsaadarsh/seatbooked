import { Listener, Subjects, TICKETUPDATED } from '@itsaadarsh/auth';
import { Message } from 'node-nats-streaming';
import ticketModel from '../../models/tickets';

export class TicketUpdatedListener extends Listener<TICKETUPDATED> {
  readonly subject = Subjects.TicketUpdated;
  queueGrpName = 'order-service';
  async onMessage(data: TICKETUPDATED['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = await ticketModel.findOne({ _id: id });
    if (ticket) {
      ticket.set({ title, price });
      await ticket.save();
    }
    msg.ack();
  }
}
