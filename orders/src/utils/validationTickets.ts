import { body } from 'express-validator';
import mongoose from 'mongoose';

const validationOrders = () => {
  return [
    body('ticketID')
      .not()
      .isEmpty()
      .custom(input => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket not provided'),
  ];
};
export default validationOrders;
