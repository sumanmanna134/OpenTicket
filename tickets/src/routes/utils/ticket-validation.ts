import { BadRequestError } from '@offlix-org/common';
import mongoose from 'mongoose';

const isValidTicket = (ticketId: string) => {
  const isValid = mongoose.Types.ObjectId.isValid(ticketId);
  if (!isValid) {
    throw new BadRequestError('Ticket id is not Valid!');
  }
};

export { isValidTicket };
