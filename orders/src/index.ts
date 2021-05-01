import mongoose from 'mongoose';
import { app } from './app';
import { natsInstace } from './natsInstance';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/listener/ticketCreated';
import { TicketUpdatedListener } from './events/listener/ticketUpdated';
import { ExpirationCompleteListener } from './events/listener/expirationComplete';
import { PaymentCreatedListener } from './events/listener/paymentCreated';

app.listen(3000, async () => {
  console.log('Orders service getting started......');

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

    new TicketCreatedListener(natsInstace.client).listen();
    new TicketUpdatedListener(natsInstace.client).listen();
    new ExpirationCompleteListener(natsInstace.client).listen();
    new PaymentCreatedListener(natsInstace.client).listen();

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
