import { Subjects, Emitter } from '@itsaadarsh/auth';

interface PAYMENTCREATED {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    orderID: string;
    stripeID: string;
  };
}

export class PaymentCreatedEmitter extends Emitter<PAYMENTCREATED> {
  readonly subject = Subjects.PaymentCreated;
}
