import nats from 'node-nats-streaming';
import { TicketCreatedEmitter } from './utils/emit-ticketCreatedClass';
console.clear();

const stan = nats.connect('seatbooked', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('EMITTER CONNECTED');

  const data = {
    id: '123asdasadass',
    title: 'Tenet',
    price: 20,
  };

  const emitEvent = new TicketCreatedEmitter(stan);
  await emitEvent.emit(data);
});
