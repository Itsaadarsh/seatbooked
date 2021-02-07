import express from 'express';
import { validationResult } from 'express-validator';
import { validationMiddleware } from '../middleware/validationSignup';
import { DBConnectionError } from '../utils/errors/dbConnectionError';
import { ReqValidationError } from '../utils/errors/reqValidationErrors';
const router = express.Router();

router.post('/api/users/signup', validationMiddleware(), (req: express.Request, res: express.Response) => {
  const valiErrors = validationResult(req);
  if (!valiErrors.isEmpty()) {
    throw new ReqValidationError(valiErrors.array());
  }
  const { email, password } = req.body;
  console.log('User Created');
  res.send({ message: 'User Created' });
});

export { router as signup };
