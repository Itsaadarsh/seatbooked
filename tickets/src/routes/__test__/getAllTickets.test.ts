import request from 'supertest';
import { app } from '../../app';
import fakeAuth from '../../utils/fakeAuth';

it('fetching all the tickets', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', fakeAuth())
    .send({
      title: 'Tenet',
      price: 10,
    })
    .expect(201);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', fakeAuth())
    .send({
      title: 'John Wick 3',
      price: 15,
    })
    .expect(201);

  const getTicketRes = await request(app).get('/api/tickets').send().expect(200);

  expect(getTicketRes.body.length).toEqual(2);
  expect(getTicketRes.body[0].title).toEqual('Tenet');
});
