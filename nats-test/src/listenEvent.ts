import { randomBytes } from 'crypto';
import nats from 'node-nats-streaming';
import { TicketCreatedListener } from './utils/listener-ticketCreatedClass';
console.clear();

const stan = nats.connect('seatbooked', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('LISTENER CONNECTED');

  stan.on('close', () => {
    console.log('Connection closed');
    process.exit();
  });
  new TicketCreatedListener(stan).listen();
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
