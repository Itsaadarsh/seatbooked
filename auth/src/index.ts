import express from 'express';
import { json } from 'body-parser';
import { currentUser } from './routes/currentUser';
import { signin } from './routes/signin';
import { signup } from './routes/signup';
import { signout } from './routes/signout';
import { errorHandler } from './middleware/errorHandling';
import { NotFound } from './utils/errors/notFound';

const app = express();
app.use(json());

app.use(currentUser);
app.use(signup);
app.use(signin);
app.use(signout);

app.all('*', (req, res) => {
  throw new NotFound();
});

app.use(errorHandler);
app.listen(3000, () => {
  console.log('Started at 3000');
});
