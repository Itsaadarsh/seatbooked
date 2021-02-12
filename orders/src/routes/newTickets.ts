import express from 'express';
import { authMiddleware, ReqValidationError } from '@itsaadarsh/auth';
import validationTickets from '../utils/validationTickets';
import { validationResult } from 'express-validator';
import ticketModel from '../models/tickets';
import { TicketCreatedEmitter } from '../events/emiter/ticketCreated';
import { natsInstace } from '../natsInstance';
const router = express.Router();

router.post(
  '/api/tickets',
  authMiddleware,
  validationTickets(),
  async (req: express.Request, res: express.Response) => {
    const valiErrors = validationResult(req);
    if (!valiErrors.isEmpty()) {
      throw new ReqValidationError(valiErrors.array());
    }
    const { title, price }: { title: string; price: number } = req.body;
    const buildTicket = ticketModel.build({ title, price, userID: req.currentUser?.id! });
    await buildTicket.save();
    new TicketCreatedEmitter(natsInstace.client).emit({
      id: buildTicket._id,
      title: buildTicket.title,
      price: buildTicket.price,
      userID: buildTicket.userID,
    });
    res.status(201).send(buildTicket);
  }
);

export { router as newTickets };
