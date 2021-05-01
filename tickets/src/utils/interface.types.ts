import { Subjects } from '@itsaadarsh/auth';

export interface TICKETCREATED {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    version: number;
    userID: string;
    price: number;
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
