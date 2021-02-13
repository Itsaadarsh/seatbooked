import express from 'express';
import { authMiddleware, BadReqError, ReqValidationError } from '@itsaadarsh/auth';
import validationOrders from '../utils/validationTickets';
import { validationResult } from 'express-validator';
import ticketModel from '../models/tickets';
import orderModel from '../models/orders';
import { OrderStatus } from '../utils/orderStatus';
const router = express.Router();

router.post(
  '/api/orders',
  authMiddleware,
  validationOrders(),
  async (req: express.Request, res: express.Response) => {
    const valiErrors = validationResult(req);
    if (!valiErrors.isEmpty()) {
      throw new ReqValidationError(valiErrors.array());
    }
    const { ticketID } = req.body;

    const isTicketAvailiable = await ticketModel.findById(ticketID);
    if (!isTicketAvailiable) {
      throw new BadReqError('Ticket does not exists');
    }

    const isReserved = await isTicketAvailiable.isReserved();
    if (isReserved) {
      throw new BadReqError('This ticket is already reserved');
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);

    const buildOrder = orderModel.build({
      userID: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: isTicketAvailiable,
    });

    await buildOrder.save();
    res.status(201).send(buildOrder);
  }
);

export { router as newOrder };
