import { OrderStatus } from '@itsaadarsh/auth';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import orderModel from '../../models/orders';
import ticketModel from '../../models/tickets';
import { natsInstace } from '../../natsInstance';
import fakeAuth from '../../utils/fakeAuth';

it('returns an error if the ticket does not exist', async () => {
  const response = await request(app).post('/api/orders').set('Cookie', fakeAuth()).send({
    ticketID: new mongoose.Types.ObjectId(),
  });
  expect(response.status).toEqual(400);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = ticketModel.build({
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = orderModel.build({
    ticket,
    userID: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app).post('/api/orders').set('Cookie', fakeAuth()).send({ ticketId: ticket.id }).expect(400);
});

it('returns the ordere', async () => {
  const buildTicket = ticketModel.build({
    title: 'Tenet',
    price: 12,
  });
  await buildTicket.save();

  const response = await request(app).post('/api/orders').set('Cookie', fakeAuth()).send({
    ticketID: buildTicket._id,
  });
  expect(response.status).toEqual(201);
});

it('publish an event', async () => {
  const buildTicket = ticketModel.build({
    title: 'Tenet',
    price: 12,
  });
  await buildTicket.save();

  const response = await request(app).post('/api/orders').set('Cookie', fakeAuth()).send({
    ticketID: buildTicket._id,
  });
  expect(response.status).toEqual(201);
  expect(natsInstace.client.publish).toHaveBeenCalled();
});
