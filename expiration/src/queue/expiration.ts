import Queue from 'bull';
import { ExpirationCompleteEmitter } from '../events/emitter/expirationComplete';
import { natsInstace } from '../natsInstance';

interface PAYLOAD {
  orderID: string;
}

const expQueue = new Queue<PAYLOAD>('exp:orders', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expQueue.process(async job => {
  new ExpirationCompleteEmitter(natsInstace.client).emit({
    orderID: job.data.orderID,
  });
});

export { expQueue };
