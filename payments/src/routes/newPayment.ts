import { authMiddleware, BadReqError, NotFound, OrderStatus, ReqValidationError } from '@itsaadarsh/auth';
import express from 'express';
import { validationResult } from 'express-validator';
import orderModel from '../models/orders';
import validationPayments from '../utils/validationPayments';

const router = express.Router();

router.post(
  '/api/payments',
  authMiddleware,
  validationPayments(),
  async (req: express.Request, res: express.Response) => {
    const valiErrors = validationResult(req);
    if (!valiErrors.isEmpty()) {
      throw new ReqValidationError(valiErrors.array());
    }

    const { token, orderID } = req.body;
    const order = await orderModel.findById(orderID);

    if (!order) {
      throw new NotFound();
    }

    if (order.userID !== req.currentUser?.id) {
      throw new BadReqError('Not Authorized');
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadReqError('This order has been cancelled');
    }

    res.send({ success: true });
  }
);

export { router as newPayment };
