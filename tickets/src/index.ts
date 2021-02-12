import mongoose from 'mongoose';
import { app } from './app';
import { natsInstace } from './natsInstance';
import { randomBytes } from 'crypto';

app.listen(3000, async () => {
  try {
    await natsInstace.connect('seatbooked', randomBytes(4).toString('hex'), 'http://nats-service:4222');

    natsInstace.client.on('close', () => {
      console.log('NATS CLOSED');
      process.exit();
    });

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
