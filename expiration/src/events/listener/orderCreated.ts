import { Listener, Subjects, ORDERCREATED } from '@itsaadarsh/auth';
import { Message } from 'node-nats-streaming';
import { expQueue } from '../../queue/expiration';

export class OrderCreatedListener extends Listener<ORDERCREATED> {
  readonly subject = Subjects.OrderCreated;
  queueGrpName = 'expiration-service';
  async onMessage(data: ORDERCREATED['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting', delay);
    await expQueue.add(
      {
        orderID: data.id,
      },
      {
        delay: 1000,
      }
    );

    msg.ack();
  }
}
