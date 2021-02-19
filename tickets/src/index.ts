import mongoose from 'mongoose';
import { app } from './app';
import { natsInstace } from './natsInstance';
import { randomBytes } from 'crypto';
import { OrderCancelledListener } from './events/listener/orderCancelled';
import { OrderCreatedListener } from './events/listener/orderCreated';

app.listen(3000, async () => {
  console.log('Tickets service getting started......');
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

    new OrderCreatedListener(natsInstace.client).listen();
    new OrderCancelledListener(natsInstace.client).listen();

    await mongoose.connect(process.env.MONGO_URI!, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB');
  } catch (err) {
    console.log(err);
  }
  console.log('Started at 3000');
});
