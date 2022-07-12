import { Ticket } from '../ticketSchema';

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '14rii494',
    device: '',
    ip: '',
  });

  await ticket.save();
  return ticket;
};
it('implements optimistic concurrency control', async () => {
  //create an instance of ticket
  const ticket = await buildTicket();

  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 10 });

  //save the first fetched ticket
  await firstInstance.save();

  //save the second fetched ticket and expect an error
  try {
    await secondInstance.save();
  } catch (err) {
    return;
  }

  throw new Error('should not reach this point');
});

it('increments the version number on multiple saves ', async () => {
  const newTicket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '14rii494',
    device: '',
    ip: '',
  });

  await newTicket.save();
  expect(newTicket.version).toEqual(0);
  await newTicket.save();
  expect(newTicket.version).toEqual(1);
  await newTicket.save();
  expect(newTicket.version).toEqual(2);
});

// // save the second fetched ticket and expect an error
//   try {
//     await secondInstance!.save();
//   } catch (err) {
//     return;
//   }
