import { natsInstace } from '../../../natsInstance';
import { TICKETUPDATED } from '@itsaadarsh/auth';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import ticketModel from '../../../models/tickets';
import { TicketUpdatedListener } from '../ticketUpdated';

const setup = async () => {
  const buildTicket = await ticketModel.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'MASTER',
  });
  await buildTicket.save();
  const listener = new TicketUpdatedListener(natsInstace.client);
  const data: TICKETUPDATED['data'] = {
    version: buildTicket.version + 1,
    id: buildTicket.id,
    title: 'TENET',
    price: 120,
    userID: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  const beforeUpdate = await ticketModel.findById(data.id);

  expect(beforeUpdate).toBeDefined();
  expect(beforeUpdate?.title).toEqual('MASTER');
  expect(beforeUpdate?.price).toEqual(10);

  await listener.onMessage(data, msg);

  const ticket = await ticketModel.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual('TENET');
  expect(ticket?.price).toEqual(120);
});

it('calling (ack) function successfully', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('event with skipped version number', async () => {
  const { listener, data, msg } = await setup();

  data.version = 8;
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
