import request from 'supertest';
import { app } from '../../app';
import ticketModel from '../../models/orders';
import { natsInstace } from '../../natsInstance';
import fakeAuth from '../../utils/fakeAuth';

it('has a route handler listening to /api/tickets for post requests', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toEqual(400);
});

it('can only be accessed if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').send({});
  expect(response.status).toBe(400);
});

it('returns a status which is not equal to 400 if the user in signed in', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', fakeAuth()).send({});
  expect(response.status).toEqual(400);
});

it('returns an error if an invalid title is provided', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', fakeAuth()).send({
    title: '',
    price: 10,
  });
  expect(response.status).toEqual(400);
});

it('returns an error if an invalid price is provided', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', fakeAuth()).send({
    title: 'Master',
    price: -10,
  });
  expect(response.status).toEqual(400);
});

it('creates a ticket with valid inputs', async () => {
  let numOfTickets = await ticketModel.find({});

  expect(numOfTickets.length).toEqual(0);
  const response = await request(app).post('/api/tickets').set('Cookie', fakeAuth()).send({
    title: 'Master',
    price: 10,
  });
  expect(response.status).not.toEqual(400);
  numOfTickets = await ticketModel.find({});
  expect(numOfTickets.length).toEqual(1);
  expect(numOfTickets[0].price).toEqual(10);
  expect(numOfTickets[0].title).toEqual('Master');
});

it('publish an event', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', fakeAuth()).send({
    title: 'Master',
    price: 10,
  });
  expect(response.status).toEqual(201);
  expect(natsInstace.client.publish).toHaveBeenCalled();
});
