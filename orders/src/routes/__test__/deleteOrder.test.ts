import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import ticketModel from '../../models/tickets';
import { natsInstace } from '../../natsInstance';
import fakeAuth from '../../utils/fakeAuth';

it('cancelling an order', async () => {
  const userCookie = fakeAuth();
  const buildTicket = ticketModel.build({
    id: new mongoose.Types.ObjectId().toHexString(),
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

it('publish an event', async () => {
  const userCookie = fakeAuth();
  const buildTicket = ticketModel.build({
    id: new mongoose.Types.ObjectId().toHexString(),
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
  expect(natsInstace.client.publish).toHaveBeenCalled();
});
