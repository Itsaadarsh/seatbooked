import { getTicket } from '../../routes/getTicket';
import ticketModel from '../tickets';

it('checking concurrency control', async completed => {
  const ticket = ticketModel.build({
    price: 12,
    title: 'tenet',
    userID: 'sadas2',
  });

  await ticket.save();

  const getTicket1 = await ticketModel.findById(ticket._id);
  const getTicket2 = await ticketModel.findById(ticket._id);

  getTicket1?.set({ price: 15 });
  getTicket2?.set({ price: 20 });

  await getTicket1?.save();
  try {
    await getTicket2?.save();
  } catch (err) {
    return completed();
  }
  throw new Error('Failed test');
});

it('check if version is increased', async () => {
  const ticket = ticketModel.build({
    price: 12,
    title: 'tenet',
    userID: 'sadas2',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);
});
