import { natsInstace } from '../../../natsInstance';
import { ORDERCREATED, OrderStatus } from '@itsaadarsh/auth';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import ticketModel from '../../../models/tickets';
import { OrderCreatedListener } from '../orderCreated';

const setup = async () => {
  const listener = new OrderCreatedListener(natsInstace.client);
  const buildTicket = ticketModel.build({
    userID: new mongoose.Types.ObjectId().toHexString(),
    title: 'TENET',
    price: 12,
  });
  await buildTicket.save();

  const data: ORDERCREATED['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: 'asd',
    userID: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: buildTicket.id,
      price: buildTicket.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, buildTicket, data, msg };
};

it('sets order id to the ticket', async () => {
  const { listener, buildTicket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await ticketModel.findById(buildTicket.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual('TENET');
  expect(ticket?.price).toEqual(12);
  expect(ticket?.orderID).toEqual(data.id);
});

it('calling (ack) function successfully', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('emits an ticket updated event', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsInstace.client.publish).toHaveBeenCalled();
});
