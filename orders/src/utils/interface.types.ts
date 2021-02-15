import { Subjects } from '@itsaadarsh/auth';
import { OrderStatus } from './orderStatus';

export interface ORDERCREATED {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userID: string;
    expiresAt: string;
    version: number;
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
    version: number;

    ticket: {
      id: string;
    };
  };
}

export interface TICKETUPDATED {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    version: number;
    userID: string;
    price: number;
  };
}
