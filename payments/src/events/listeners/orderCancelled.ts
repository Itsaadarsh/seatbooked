import { Listener, Subjects, ORDERCANCELLED } from '@itsaadarsh/auth';
import { Message } from 'node-nats-streaming';
import orderModel from '../../models/orders';
import { OrderStatus } from '../../utils/orderStatus';

export class OrderCancelledListener extends Listener<ORDERCANCELLED> {
  readonly subject = Subjects.OrderCancelled;
  queueGrpName = 'payments-service';

  async onMessage(data: ORDERCANCELLED['data'], msg: Message) {
    const order = await orderModel.findOne({
      _id: data.id,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    msg.ack();
  }
}
