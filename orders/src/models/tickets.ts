import mongoose from 'mongoose';
import { OrderStatus } from '../utils/orderStatus';
import orderModel from './orders';

interface TICKET {
  title: string;
  price: number;
}

export interface TICKETDOC extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface TICKETMODEL extends mongoose.Model<TICKETDOC> {
  build(props: TICKET): TICKETDOC;
}

const ticketSchema = new mongoose.Schema({
  title: { type: mongoose.Schema.Types.String, required: true },
  price: { type: mongoose.Schema.Types.Number, required: true, min: 0 },
});

ticketSchema.statics.build = (props: TICKETDOC) => {
  return new ticketModel(props);
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
