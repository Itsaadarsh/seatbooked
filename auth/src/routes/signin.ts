import express from 'express';

const router = express.Router();

router.get('/api/users/signin', (req: express.Request, res: express.Response) => {
  res.send({
    data: {
      userid: 1,
      username: 'itsaadarsh',
    },
  });
});

export { router as signin };
