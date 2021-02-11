import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { errorHandler, NotFound, currentUser } from '@itsaadarsh/auth';
import { newTickets } from './routes/newTickets';
import { getTicket } from './routes/getTicket';
import { getAllTickets } from './routes/getAllTickets';
import { updateTicket } from './routes/updateTicket';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({ signed: false, secure: false }));
app.use(currentUser);

app.use(newTickets);
app.use(getTicket);
app.use(getAllTickets);
app.use(updateTicket);
app.all('*', async (req, res) => {
  throw new NotFound();
});
app.use(errorHandler);

export { app };
