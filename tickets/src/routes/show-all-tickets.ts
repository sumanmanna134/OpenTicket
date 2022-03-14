import { currentUser, NotFoundError, requireAuth } from '@offlix-org/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticketSchema';

const router = express.Router();
const fetchTicket = async (req: Request, res: Response) => {
  await Ticket.find({})
    .then((ticket) => {
      res.status(200).send({
        message:
          ticket.length == 0
            ? 'No Tickets'
            : 'Successfully fetched all Tickets',
        tickets: ticket,
        count: ticket.length,
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};
router.get('/api/tickets', currentUser, requireAuth, fetchTicket);
export { router as showAllTicketRouter };
