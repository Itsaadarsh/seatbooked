import { body } from 'express-validator';

const validationTickets = () => {
  return [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),
  ];
};
export default validationTickets;
