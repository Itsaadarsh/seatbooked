import { Subjects } from '@itsaadarsh/auth';
import { OrderStatus } from './orderStatus';

export interface ORDERCREATED {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userID: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}

export interface ORDERCANCELLED {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
