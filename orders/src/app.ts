import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import { errorHandler, NotFound, currentUser } from '@itsaadarsh/auth';
import { newOrder } from './routes/newOrder';
// import { getOrderByID } from './routes/getOrderByID';
// import { getAllOrders } from './routes/getAllOrders';
// import { deleteOrders } from './routes/deleteOrders';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({ signed: false, secure: false }));
app.use(currentUser);

app.use(newOrder);
// app.use(getOrderByID);
// app.use(getAllOrders);
// app.use(deleteOrders);
app.all('*', async (req, res) => {
  throw new NotFound();
});
app.use(errorHandler);

export { app };
