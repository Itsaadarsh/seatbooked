import { body } from 'express-validator';
import mongoose from 'mongoose';

const validationPayments = () => {
  return [
    body('token').not().isEmpty().withMessage('Token is required'),
    body('orderID')
      .not()
      .isEmpty()
      .custom(input => mongoose.Types.ObjectId.isValid(input))
      .withMessage('OrderID is required'),
  ];
};
export default validationPayments;
