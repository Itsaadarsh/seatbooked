import request from 'supertest';
import { app } from '../../app';
import ticketModel from '../../models/tickets';
import fakeAuth from '../../utils/fakeAuth';

it('fetching all the orders of a particular user', async () => {
  const userCookie = fakeAuth();
  const buildTicket = ticketModel.build({
    title: 'Tenet',
    price: 12,
  });
  await buildTicket.save();

  await request(app).post('/api/orders').set('Cookie', userCookie).send({
    ticketID: buildTicket._id,
  });

  const response = await request(app).get('/api/orders').set('Cookie', userCookie).send();
  expect(response.status).toEqual(200);
});
