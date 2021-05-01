import express from 'express';
import { NotFound } from '@itsaadarsh/auth';
import ticketModel from '../models/tickets';
const router = express.Router();

router.get('/api/tickets/:id', async (req: express.Request, res: express.Response) => {
  const getID = req.params.id;

  const isTicketAvai = await ticketModel.findOne({ _id: getID });

  if (isTicketAvai) {
    res.status(200).send(isTicketAvai);
  } else {
    throw new NotFound();
  }
});

export { router as getTicket };
