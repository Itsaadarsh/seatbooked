import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import fakeAuth from '../../utils/fakeAuth';

it('returns a 404 if ID does not exists ', async () => {
  const response = await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set('Cookie', fakeAuth())
    .send({
      title: 'asd',
      price: 12,
    });
  expect(response.status).toEqual(400);
});

it('returns a 401 if the user is not authenticated', async () => {
  const response = await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({
      title: 'asd',
      price: 12,
    });

  expect(response.status).toEqual(400);
});
it('returns a 401 if the user does not own the ticket', async () => {});
it('returns a 400 if the user provides an invalid title or price', async () => {});
