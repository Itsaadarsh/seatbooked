import express from 'express';
import { authMiddleware, ReqValidationError } from '@itsaadarsh/auth';
import validationOrders from '../utils/validationTickets';
import { validationResult } from 'express-validator';
const router = express.Router();

router.post(
  '/api/tickets',
  authMiddleware,
  validationOrders(),
  async (req: express.Request, res: express.Response) => {
    const valiErrors = validationResult(req);
    if (!valiErrors.isEmpty()) {
      throw new ReqValidationError(valiErrors.array());
    }
  }
);

export { router as newOrder };
