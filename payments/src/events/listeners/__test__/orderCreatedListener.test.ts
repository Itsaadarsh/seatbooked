import { natsInstace } from '../../../natsInstance';
import { ORDERCREATED, OrderStatus } from '@itsaadarsh/auth';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import orderModel from '../../../models/orders';
import { OrderCreatedListener } from '../orderCreated';

const setup = async () => {
  const listener = new OrderCreatedListener(natsInstace.client);

  const data: ORDERCREATED['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'alskdjf',
    userID: 'alskdjf',
    status: OrderStatus.Created,
    ticket: {
      id: 'alskdfj',
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('return the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await orderModel.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
});

it('calling (ack) function successfully', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
