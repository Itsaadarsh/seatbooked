import { Listener, Subjects, ORDERCREATED } from '@itsaadarsh/auth';
import { Message } from 'node-nats-streaming';
import ticketModel from '../../models/tickets';
import { TicketUpdatedEmitter } from '../emiter/ticketUpdated';

export class OrderCreatedListener extends Listener<ORDERCREATED> {
  readonly subject = Subjects.OrderCreated;
  queueGrpName = 'ticket-service';
  async onMessage(data: ORDERCREATED['data'], msg: Message) {
    const ticket = await ticketModel.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found!');
    }

    ticket.set({ orderID: data.id });
    await ticket.save();

    new TicketUpdatedEmitter(this.client).emit({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userID: ticket.userID,
      version: ticket.version,
    });

    msg.ack();
  }
}
