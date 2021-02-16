import { natsInstace } from '../../../natsInstance';
import { EXPIRATIONCOMPLETE, OrderStatus } from '@itsaadarsh/auth';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import ticketModel from '../../../models/tickets';
import { ExpirationCompleteListener } from '../expirationComplete';
import orderModel from '../../../models/orders';

const setup = async () => {
  const buildTicket = await ticketModel.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    title: 'MASTER',
  });
  await buildTicket.save();

  const buildOrder = await orderModel.build({
    status: OrderStatus.Created,
    ticket: buildTicket,
    userID: 'asda',
    expiresAt: new Date(),
  });
  await buildOrder.save();

  const listener = new ExpirationCompleteListener(natsInstace.client);

  const data: EXPIRATIONCOMPLETE['data'] = {
    orderID: buildOrder.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, buildOrder, buildTicket, data, msg };
};

it('update the order status to cancelled', async () => {
  const { listener, buildOrder, data, msg } = await setup();

  await listener.onMessage(data, msg);
  const updateOrder = await orderModel.findById(buildOrder.id);
  console.log(updateOrder);

  expect(updateOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { listener, buildOrder, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsInstace.client.publish).toHaveBeenCalled();
  const natsData = JSON.parse((natsInstace.client.publish as jest.Mock).mock.calls[0][1]);
  expect(natsData.id).toEqual(buildOrder.id);
});

it('calling (ack) function successfully', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
