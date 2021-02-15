import mongoose from 'mongoose';
import { OrderStatus } from '../utils/orderStatus';
import { TICKETDOC } from './tickets';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
interface ORDER {
  userID: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TICKETDOC;
}

interface ORDERDOC extends mongoose.Document {
  userID: string;
  status: OrderStatus;
  expiresAt: Date;
  version: number;
  ticket: TICKETDOC;
}

interface ORDERMODEL extends mongoose.Model<ORDERDOC> {
  build(props: ORDER): ORDERDOC;
}

const orderSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.String, required: true },
  status: {
    type: mongoose.Schema.Types.String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  expiresAt: { type: mongoose.Schema.Types.Date },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tickets',
  },
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (props: ORDERDOC) => {
  return new orderModel(props);
};

const orderModel = mongoose.model<ORDERDOC, ORDERMODEL>('Orders', orderSchema);

export default orderModel;
