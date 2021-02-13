import express from 'express';
import { authMiddleware, NotFound } from '@itsaadarsh/auth';
import orderModel from '../models/orders';
const router = express.Router();

router.get('/api/orders/:id', authMiddleware, async (req: express.Request, res: express.Response) => {
  const getID = req.params.id;

  const isOrderAvailiable = await orderModel
    .findOne({ _id: getID, userID: req.currentUser?.id })
    .populate('ticket');

  if (isOrderAvailiable) {
    res.status(200).send(isOrderAvailiable);
  } else {
    throw new NotFound();
  }
});

export { router as getOrderByID };
