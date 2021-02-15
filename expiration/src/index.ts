import { natsInstace } from './natsInstance';
import { randomBytes } from 'crypto';

const connect = async () => {
  try {
    await natsInstace.connect(
      process.env.NATS_CLUSTER_ID!,
      randomBytes(4).toString('hex'),
      process.env.NATS_URL!
    );

    natsInstace.client.on('close', () => {
      console.log('NATS CLOSED');
      process.exit();
    });
  } catch (err) {
    console.log(err);
  }
};

connect();
