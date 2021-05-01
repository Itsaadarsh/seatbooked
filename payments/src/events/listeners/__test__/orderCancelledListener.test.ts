import { natsInstace } from '../../../natsInstance';
import { ORDERCANCELLED, OrderStatus } from '@itsaadarsh/auth';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import orderModel from '../../../models/orders';
import { OrderCancelledListener } from '../orderCancelled';

const setup = async () => {
  const listener = new OrderCancelledListener(natsInstace.client);

  const order = orderModel.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userID: 'asd',
    version: 0,
  });
  await order.save();

  const data: ORDERCANCELLED['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'alskdfj',
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it('return the order info', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);
  const updatedOrder = await orderModel.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('calling (ack) function successfully', async () => {
  const { listener, data, msg, order } = await setup();

  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
