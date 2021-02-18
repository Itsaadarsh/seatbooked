import mongoose from 'mongoose';
import { OrderStatus } from '../utils/orderStatus';

interface ORDER {
  id: string;
  userID: string;
  version: number;
  price: number;
  status: OrderStatus;
}

interface ORDERDOC extends mongoose.Document {
  userID: string;
  version: number;
  price: number;
  status: OrderStatus;
}

interface ORDERMODEL extends mongoose.Model<ORDERDOC> {
  build(props: ORDER): ORDERDOC;
}

const orderSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.String, required: true },
  price: { type: mongoose.Schema.Types.Number, required: true },
  status: {
    type: mongoose.Schema.Types.String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
});

orderSchema.statics.build = (props: ORDERDOC) => {
  return new orderModel({
    _id: props.id,
    version: props.version,
    price: props.price,
    userID: props.userID,
    status: props.status,
  });
};

const orderModel = mongoose.model<ORDERDOC, ORDERMODEL>('Orders', orderSchema);

export default orderModel;
