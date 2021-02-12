import express from 'express';
import { authMiddleware, ReqValidationError, NotFound, BadReqError } from '@itsaadarsh/auth';
import validationTickets from '../utils/validationTickets';
import { validationResult } from 'express-validator';
import ticketModel from '../models/tickets';
import { TicketUpdatedEmitter } from '../events/emiter/ticketUpdated';
import { natsInstace } from '../natsInstance';
const router = express.Router();

router.put(
  '/api/tickets/:id',
  authMiddleware,
  validationTickets(),
  async (req: express.Request, res: express.Response) => {
    const valiErrors = validationResult(req);
    if (!valiErrors.isEmpty()) {
      throw new ReqValidationError(valiErrors.array());
    }

    const { title, price }: { title: string; price: number } = req.body;
    const isTicket = await ticketModel.findOne({ _id: req.params.id });
    if (!isTicket) {
      throw new NotFound();
    }

    if (isTicket.userID !== req.currentUser!.id) {
      throw new BadReqError('Not Authorized');
    }

    // Updating the ticket
    isTicket.set({
      title,
      price,
    });
    isTicket.save();

    new TicketUpdatedEmitter(natsInstace.client).emit({
      id: isTicket._id,
      title: isTicket.title,
      price: isTicket.price,
      userID: isTicket.userID,
    });

    res.send(isTicket);
  }
);

export { router as updateTicket };
