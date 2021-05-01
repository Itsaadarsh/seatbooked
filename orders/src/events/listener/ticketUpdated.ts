import { Listener, Subjects } from '@itsaadarsh/auth';
import { Message } from 'node-nats-streaming';
import ticketModel from '../../models/tickets';
import { TICKETUPDATED } from '../../utils/interface.types';

export class TicketUpdatedListener extends Listener<TICKETUPDATED> {
  readonly subject = Subjects.TicketUpdated;
  queueGrpName = 'order-service';
  async onMessage(data: TICKETUPDATED['data'], msg: Message) {
    const ticket = await ticketModel.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
