import { Listener, Subjects, ORDERCREATED } from '@itsaadarsh/auth';
import { Message } from 'node-nats-streaming';
import orderModel from '../../models/orders';

export class OrderCreatedListener extends Listener<ORDERCREATED> {
  readonly subject = Subjects.OrderCreated;
  queueGrpName = 'payments-service';

  async onMessage(data: ORDERCREATED['data'], msg: Message) {
    const order = orderModel.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userID: data.userID,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
