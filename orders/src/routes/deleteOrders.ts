import express from 'express';
import { authMiddleware, NotFound } from '@itsaadarsh/auth';
import orderModel from '../models/orders';
import { OrderStatus } from '../utils/orderStatus';
const router = express.Router();

router.patch('/api/orders/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
  const getID = req.params.id;

  const updateOrder = await orderModel
    .findOne({ _id: getID, userID: req.currentUser?.id })
    .populate('ticket');

  if (updateOrder) {
    updateOrder.status = OrderStatus.Cancelled;
    updateOrder.save();
    res.status(200).send(updateOrder);
  } else {
    throw new NotFound();
  }
});

export { router as deleteOrder };
