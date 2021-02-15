import { natsInstace } from '../../../natsInstance';
import { TicketCreatedListener } from '../ticketCreated';
import { TICKETCREATED } from '@itsaadarsh/auth';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import ticketModel from '../../../models/tickets';

const setup = async () => {
  const listener = new TicketCreatedListener(natsInstace.client);
  const data: TICKETCREATED['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'TENET',
    price: 12,
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

  await listener.onMessage(data, msg);

  const ticket = await ticketModel.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual('TENET');
  expect(ticket?.price).toEqual(12);
});

it('calling (ack) function successfully', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
