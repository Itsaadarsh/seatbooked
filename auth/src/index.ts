import express from 'express';
import { json } from 'body-parser';

const app = express();
app.use(json());

app.get('/api/users/currentuser', (req: express.Request, res: express.Response) => {
  res.send({
    data: {
      userid: 1,
      username: 'itsaadarsh',
    },
  });
});

app.listen(3000, () => {
  console.log('Started at 3000');
});
