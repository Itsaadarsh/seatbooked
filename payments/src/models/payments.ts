import mongoose from 'mongoose';

interface PAYMENT {
  orderID: string;
  stripeID: string;
}

interface PAYMENTDOC extends mongoose.Document {
  orderID: string;
  stripeID: string;
}

interface PAYMENTMODEL extends mongoose.Model<PAYMENTDOC> {
  build(props: PAYMENT): PAYMENTDOC;
}

const paymentSchema = new mongoose.Schema({
  orderID: { type: mongoose.Schema.Types.String, required: true },
  stripeID: { type: mongoose.Schema.Types.String, required: true },
});

paymentSchema.statics.build = (props: PAYMENTDOC) => {
  return new paymentModel(props);
};

const paymentModel = mongoose.model<PAYMENTDOC, PAYMENTMODEL>('Payments', paymentSchema);

export default paymentModel;
