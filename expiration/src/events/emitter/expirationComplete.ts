import { Subjects, Emitter } from '@itsaadarsh/auth';

interface EXPIRATIONCOMPLETE {
  subject: Subjects.ExpirationComplete;
  data: {
    orderID: string;
  };
}

export class ExpirationCompleteEmitter extends Emitter<EXPIRATIONCOMPLETE> {
  readonly subject = Subjects.ExpirationComplete;
}
