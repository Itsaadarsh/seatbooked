import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
interface TICKET {
  userID: string;
  title: string;
  price: number;
}

interface TICKETDOC extends mongoose.Document {
  userID: string;
  title: string;
  price: number;
  version: number;
  orderID?: string;
}

interface TICKETMODEL extends mongoose.Model<TICKETDOC> {
  build(props: TICKET): TICKETDOC;
}

const ticketSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.String, required: true },
  title: { type: mongoose.Schema.Types.String, required: true },
  price: { type: mongoose.Schema.Types.Number, required: true },
  orderID: { type: mongoose.Schema.Types.String },
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (props: TICKETDOC) => {
  return new ticketModel(props);
};

const ticketModel = mongoose.model<TICKETDOC, TICKETMODEL>('Tickets', ticketSchema);

export default ticketModel;
