import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  currentUser,
  requireAuth,
  UnAuthorizedError,
  validateRequest,
} from '@offlix-org/common';
const router = express.Router();
import mongoose from 'mongoose';
import { Ticket } from '../models/ticketSchema';
import { isValidTicket } from './utils/ticket-validation';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
const updateTicket = async (req: Request, res: Response) => {
  const ticketId = req.params.id;
  const { title, price } = req.body;
  const ip = req.headers['x-real-ip'];
  const currentUserId = req.currentUser?.id;

  isValidTicket(ticketId);

  await Ticket.findById(ticketId)
    .then(async (ticket) => {
      if (!ticket) {
        throw new BadRequestError('Ticket not Found!');
      }

      if (ticket.userId !== currentUserId) {
        throw new BadRequestError(
          'You do not have permission to modify this ticket'
        );
      }

      await ticket.set({ title, price, ip, currentUserId });

      await ticket.save();
      new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });
      res.send({
        message: `${title} updated Successfully!`,
        ticket: ticket,
      });
    })
    .catch((err) => {
      throw new BadRequestError(err.message);
    });
};

//check TicketId is Valid or Not
//if not valid it throws 400 BAD_REQUEST Error

const validation = [
  body('title').notEmpty().withMessage('Title is required!'),
  body('price')
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),
];
router.put(
  '/api/tickets/:id',
  currentUser,
  requireAuth,
  validation,
  validateRequest,
  updateTicket
);
export { router as updateTicketRouter };
