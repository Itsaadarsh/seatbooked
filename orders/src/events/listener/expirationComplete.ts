import { EXPIRATIONCOMPLETE, Listener, Subjects, TICKETCREATED } from '@itsaadarsh/auth';
import { Message } from 'node-nats-streaming';
import orderModel from '../../models/orders';
import { natsInstace } from '../../natsInstance';
import { OrderStatus } from '../../utils/orderStatus';
import { OrderCancelledEmitter } from '../emiter/orderCancelled';

export class ExpirationCompleteListener extends Listener<EXPIRATIONCOMPLETE> {
  readonly subject = Subjects.ExpirationComplete;
  queueGrpName = 'expiration-service';
  async onMessage(data: EXPIRATIONCOMPLETE['data'], msg: Message) {
    const order = await orderModel.findById(data.orderID).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    new OrderCancelledEmitter(natsInstace.client).emit({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });
    msg.ack();
  }
}
