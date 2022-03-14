import { BadRequestError, currentUser, requireAuth } from '@offlix-org/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticketSchema';
import { isValidTicket } from './utils/ticket-validation';
const router = express.Router();

const deleteTicket = async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  let ticketName = '';
  isValidTicket(ticketId);
  await Ticket.findById({ _id: ticketId })
    .then(async (ticket) => {
      if (!ticket) {
        throw new BadRequestError('Ticket Not found!');
      }
      if (ticket.userId !== req.currentUser?.id) {
        throw new BadRequestError(
          'You do not have permission to delete this ticket'
        );
      }
      await Ticket.deleteOne(ticket);
      ticketName = ticket.title;
    })
    .then((value) =>
      res.status(200).send({
        message: `${ticketName} has been deleted successfully`,
      })
    )
    .catch((e) => {
      throw new BadRequestError(e.message);
    });
};

router.delete('/api/tickets/:id', currentUser, requireAuth, deleteTicket);
export { router as deleteTicketRouter };
