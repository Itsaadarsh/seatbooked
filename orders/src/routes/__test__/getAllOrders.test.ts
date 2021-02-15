import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import ticketModel from '../../models/tickets';
import fakeAuth from '../../utils/fakeAuth';

it('fetching all the orders of a particular user', async () => {
  const userCookie = fakeAuth();
  const buildTicket = ticketModel.build({
    id: new mongoose.Types.ObjectId().toHexString(),
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
