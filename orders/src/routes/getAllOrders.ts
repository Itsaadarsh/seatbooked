import express from 'express';
import { authMiddleware, NotFound } from '@itsaadarsh/auth';
import orderModel from '../models/orders';
const router = express.Router();

router.get('/api/orders/', authMiddleware, async (req: express.Request, res: express.Response) => {
  const getAllOrders = await orderModel.find({ userID: req.currentUser?.id }).populate('ticket');

  if (getAllOrders.length > 0) {
    return res.status(200).send(getAllOrders);
  } else {
    throw new NotFound();
  }
});

export { router as getAllOrders };
