import { randomBytes } from 'crypto';
import nats, { Message } from 'node-nats-streaming';
console.clear();

const stan = nats.connect('seatbooked', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('LISTENER CONNECTED');

  stan.on('close', () => {
    console.log('Connection closed');
    process.exit();
  });
  const options = stan.subscriptionOptions().setManualAckMode(true);
  const subscription = stan.subscribe('ticket:created', 'order-service-queueGrp', options);

  subscription.on('message', (msg: Message) => {
    const subData = msg.getData();

    if (typeof subData === 'string') {
      console.log(msg.getSequence(), subData);
    }

    msg.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
