import { authMiddleware, BadReqError, NotFound, OrderStatus, ReqValidationError } from '@itsaadarsh/auth';
import express from 'express';
import { validationResult } from 'express-validator';
import { PaymentCreatedEmitter } from '../events/emitter/paymentCreated';
import orderModel from '../models/orders';
import paymentModel from '../models/payments';
import { natsInstace } from '../natsInstance';
import { stripe } from '../stripe';
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

    const order = await orderModel.findOne({ _id: orderID });

    if (!order) {
      throw new NotFound();
    }
    if (order.userID !== req.currentUser!.id) {
      throw new BadReqError('not authorized');
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadReqError('Cannot pay for an cancelled order');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
      description: 'test',
      shipping: {
        name: 'Jenny Rosen',
        address: {
          line1: '510 Townsend St',
          postal_code: '98140',
          city: 'San Francisco',
          state: 'CA',
          country: 'US',
        },
      },
    });

    const payment = paymentModel.build({
      orderID,
      stripeID: charge.id,
    });
    await payment.save();

    new PaymentCreatedEmitter(natsInstace.client).emit({
      id: payment.id,
      orderID: payment.orderID,
      stripeID: payment.stripeID,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as newPayment };
