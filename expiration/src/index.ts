import { natsInstace } from './natsInstance';
import { OrderCreatedListener } from './events/listener/orderCreated';

const connect = async () => {
  try {
    await natsInstace.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URL!
    );

    natsInstace.client.on('close', () => {
      console.log('NATS CLOSED');
      process.exit();
    });
    new OrderCreatedListener(natsInstace.client).listen();
  } catch (err) {
    console.log(err);
  }
};

connect();
