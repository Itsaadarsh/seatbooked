import { Listener, Subjects, PAYMENTCREATED, OrderStatus } from '@itsaadarsh/auth';
import { Message } from 'node-nats-streaming';
import orderModel from '../../models/orders';

export class PaymentCreatedListener extends Listener<PAYMENTCREATED> {
  readonly subject = Subjects.PaymentCreated;
  queueGrpName = 'order-service';
  async onMessage(data: PAYMENTCREATED['data'], msg: Message) {
    const order = await orderModel.findById(data.id);
    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
