import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import fakeAuth from '../../utils/fakeAuth';

it('return a 404 if the ticket is not found', async () => {
  const response = await request(app)
    .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send();
  expect(response.status).toEqual(400);
});

it('return a 404 if the ticket is found', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', fakeAuth())
    .send({
      title: 'Tenet',
      price: 100,
    })
    .expect(201);

  const ticketRes = await request(app)
    .get(`/api/tickets/${response.body._id}`)
    .set('Cookie', fakeAuth())
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual('Tenet');
  expect(ticketRes.body.price).toEqual(100);
});
