import mongoose from 'mongoose';
import { OrderStatus } from '../utils/orderStatus';
import orderModel from './orders';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TICKET {
  id: string;
  title: string;
  price: number;
}

export interface TICKETDOC extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TICKETMODEL extends mongoose.Model<TICKETDOC> {
  build(props: TICKET): TICKETDOC;
  findByEvent(event: { id: string; version: number }): Promise<TICKETDOC | null>;
}

const ticketSchema = new mongoose.Schema({
  title: { type: mongoose.Schema.Types.String, required: true },
  price: { type: mongoose.Schema.Types.Number, required: true, min: 0 },
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return ticketModel.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.statics.build = (props: TICKETDOC) => {
  return new ticketModel({
    _id: props.id,
    title: props.title,
    price: props.price,
  });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await orderModel.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete],
    },
  });

  return !!existingOrder;
};

const ticketModel = mongoose.model<TICKETDOC, TICKETMODEL>('Tickets', ticketSchema);

export default ticketModel;
