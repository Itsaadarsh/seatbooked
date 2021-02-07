import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { currentUser } from './routes/currentUser';
import { signin } from './routes/signin';
import { signup } from './routes/signup';
import { signout } from './routes/signout';
import { errorHandler } from './middleware/errorHandling';
import { NotFound } from './utils/errors/notFound';
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(json());

app.use(currentUser);
app.use(signup);
app.use(signin);
app.use(signout);
app.all('*', async (req, res) => {
  throw new NotFound();
});

app.use(errorHandler);
app.listen(3000, async () => {
  try {
    await mongoose.connect('mongodb://auth-mongo-service:27017/auth', {
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
