import request from 'supertest';
import { app } from '../../app';
import orderModel from '../../models/orders';
import ticketModel from '../../models/tickets';
import fakeAuth from '../../utils/fakeAuth';

it('cancelling an order', async () => {
  const userCookie = fakeAuth();
  const buildTicket = ticketModel.build({
    title: 'Tenet',
    price: 12,
  });
  await buildTicket.save();

  const orderRes = await request(app).post('/api/orders').set('Cookie', userCookie).send({
    ticketID: buildTicket._id,
  });

  const response = await request(app)
    .patch(`/api/orders/${orderRes.body._id}`)
    .set('Cookie', userCookie)
    .send();
  expect(response.status).toEqual(200);
  expect(response.body.status).toEqual('cancelled');
});
