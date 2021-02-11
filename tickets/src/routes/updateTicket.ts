import express from 'express';
import { authMiddleware, ReqValidationError, NotFound, BadReqError } from '@itsaadarsh/auth';
import validationTickets from '../utils/validationTickets';
import { validationResult } from 'express-validator';
import ticketModel from '../models/tickets';
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
    const isTicket = await ticketModel.findOne({ _id: req.params.id });
    if (isTicket) {
      return res.send(isTicket);
    } else {
      throw new NotFound();
    }
  }
);

export { router as updateTicket };
