import Queue from 'bull';

interface PAYLOAD {
  orderID: string;
}

const expQueue = new Queue<PAYLOAD>('exp:orders', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expQueue.process(async job => {
  console.log('Expiration completed for ID : ', job.data.orderID);
});

export { expQueue };
