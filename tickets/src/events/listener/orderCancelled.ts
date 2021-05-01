import { Listener, Subjects, ORDERCANCELLED } from '@itsaadarsh/auth';
import { Message } from 'node-nats-streaming';
import ticketModel from '../../models/tickets';
import { TicketUpdatedEmitter } from '../emiter/ticketUpdated';

export class OrderCancelledListener extends Listener<ORDERCANCELLED> {
  readonly subject = Subjects.OrderCancelled;
  queueGrpName = 'ticket-service';
  async onMessage(data: ORDERCANCELLED['data'], msg: Message) {
    const ticket = await ticketModel.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found!');
    }

    ticket.set({ orderID: undefined });
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
