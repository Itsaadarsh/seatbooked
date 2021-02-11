import nats from 'node-nats-streaming';
console.clear();

const stan = nats.connect('seatbooked', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', () => {
  console.log('EMITTER CONNECTED');

  const data = JSON.stringify({
    id: '123asdasadass',
    title: 'Tenet',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('Event Emitted');
  });
});
