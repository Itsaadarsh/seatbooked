import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import orderModel from '../../models/orders';
import { OrderStatus } from '@itsaadarsh/auth';
import fakeAuth from '../../utils/fakeAuth';
import { stripe } from '../../stripe';
import paymentModel from '../../models/payments';

it('Error when the order does not exist', async () => {
  const response = await request(app).post('/api/payments').set('Cookie', fakeAuth()).send({
    token: 'as',
    orderID: new mongoose.Types.ObjectId().toHexString(),
  });
  expect(response.status).toEqual(400);
});

it('Error when user id does not matches', async () => {
  const buildOrder = orderModel.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 12,
    status: OrderStatus.Created,
    userID: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  });
  await buildOrder.save();

  const response = await request(app).post('/api/payments').set('Cookie', fakeAuth()).send({
    token: 'as',
    orderID: buildOrder.id,
  });
  expect(response.status).toEqual(400);
});

it('Error when the order has been cancelled', async () => {
  const userID = new mongoose.Types.ObjectId().toHexString();
  const buildOrder = orderModel.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 12,
    status: OrderStatus.Cancelled,
    userID,
    version: 0,
  });
  await buildOrder.save();

  const response = await request(app).post('/api/payments').set('Cookie', fakeAuth(userID)).send({
    token: 'as',
    orderID: buildOrder.id,
  });

  expect(response.status).toEqual(400);
});

it('returns an 201 with valid input', async () => {
  const userID = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 1000);

  const buildOrder = orderModel.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price,
    status: OrderStatus.Created,
    userID,
    version: 0,
  });
  await buildOrder.save();

  const response = await request(app).post('/api/payments').set('Cookie', fakeAuth(userID)).send({
    token: 'tok_visa',
    orderID: buildOrder._id,
  });

  expect(response.status).toEqual(201);

  const stripeCharges = await stripe.charges.list({ limit: 50 });

  const stripeAmt = stripeCharges.data.find(amt => {
    return amt.amount === price * 100;
  });

  expect(stripeAmt).toBeDefined();
  expect(stripeAmt?.amount).toEqual(price * 100);
  expect(stripeAmt?.currency).toEqual('usd');

  const payment = await paymentModel.findOne({ orderID: buildOrder.id, stripeID: stripeAmt!.id });
  expect(payment).not.toBeNull();
});
