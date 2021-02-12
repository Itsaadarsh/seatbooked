import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { natsInstace } from '../../natsInstance';
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

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', fakeAuth()).send({
    title: 'Master',
    price: 10,
  });

  const putRes = await request(app).put(`/api/tickets/${response.body._id}`).set('Cookie', fakeAuth()).send({
    title: 'John Wick 2',
    price: 12,
  });
  expect(putRes.status).toEqual(400);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = fakeAuth();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'Master',
    price: 10,
  });

  const putRes = await request(app).put(`/api/tickets/${response.body._id}`).set('Cookie', cookie).send({
    title: '',
    price: -12,
  });

  expect(putRes.status).toEqual(400);
  expect(putRes.body.errors.length).toEqual(2);
});

it('updates the ticket successfully with the given parameters', async () => {
  const cookie = fakeAuth();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'Master',
    price: 10,
  });

  const putRes = await request(app)
    .put(`/api/tickets/${response.body._id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Tenet',
      price: 12,
    })
    .expect(200);

  expect(putRes.body.title).toEqual('Tenet');
  expect(putRes.body.price).toEqual(12);

  const ticketRes = await request(app)
    .get(`/api/tickets/${response.body._id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual('Tenet');
  expect(ticketRes.body.price).toEqual(12);
});

it('publish an event', async () => {
  const cookie = fakeAuth();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'Master',
    price: 10,
  });

  const putRes = await request(app)
    .put(`/api/tickets/${response.body._id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Tenet',
      price: 12,
    })
    .expect(200);

  expect(putRes.body.title).toEqual('Tenet');
  expect(putRes.body.price).toEqual(12);

  await request(app).get(`/api/tickets/${response.body._id}`).set('Cookie', cookie).send().expect(200);
  expect(natsInstace.client.publish).toHaveBeenCalled();
});
