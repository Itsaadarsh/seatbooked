import express from 'express';
import { authMiddleware, NotFound } from '@itsaadarsh/auth';
import orderModel from '../models/orders';
import { OrderStatus } from '../utils/orderStatus';
import { OrderCancelledEmitter } from '../events/emiter/orderCancelled';
import { natsInstace } from '../natsInstance';
const router = express.Router();

router.patch('/api/orders/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
  const getID = req.params.id;

  const updateOrder = await orderModel
    .findOne({ _id: getID, userID: req.currentUser?.id })
    .populate('ticket');

  if (updateOrder) {
    updateOrder.status = OrderStatus.Cancelled;
    updateOrder.save();

    new OrderCancelledEmitter(natsInstace.client).emit({
      id: updateOrder._id,
      ticket: {
        id: updateOrder.ticket._id,
      },
    });

    res.status(200).send(updateOrder);
  } else {
    throw new NotFound();
  }
});

export { router as deleteOrder };
