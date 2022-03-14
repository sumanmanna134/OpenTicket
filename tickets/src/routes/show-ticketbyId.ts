import {
  BadRequestError,
  currentUser,
  NotFoundError,
  requireAuth,
} from '@offlix-org/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticketSchema';

const router = express.Router();
const fetchTicket = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const response = await Ticket.findOne({ _id: id });
    if (!response) {
      throw new Error('Product not found!');
    }
    res.status(200).send(response);
  } catch (e) {
    throw new BadRequestError('Product not found!');
  }
};
router.get('/api/tickets/:id', currentUser, requireAuth, fetchTicket);
export { router as showTicketRouter };
