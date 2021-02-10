import express from 'express';
import { currentUser, authMiddleware } from '@itsaadarsh/auth';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  authMiddleware,
  async (req: express.Request, res: express.Response) => {
    res.status(200).json({ currentUser: req.currentUser });
  }
);

export { router as currentUser };
