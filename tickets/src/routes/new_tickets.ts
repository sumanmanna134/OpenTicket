import {
  currentUser,
  RequestValidationError,
  requireAuth,
  validateRequest,
} from '@offlix-org/common';
import express, { Request, Response } from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import { Ticket } from '../models/ticketSchema';
const router = express.Router();

const createNewTickets = async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id,
    device: req.headers['user-agent'] ?? '',
    ip: req.headers['x-real-ip'] ?? '',
  });

  await ticket
    .save()
    .then((info) => {
      res.status(201).send({
        message: 'Ticket booked Successfully',
        ticketInfo: info,
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};
const validation = [
  body('title').notEmpty().withMessage('Title is required!'),
  body('price')
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage('Price must be greater than 0'),
];
router.post(
  '/api/tickets',
  currentUser,
  requireAuth,
  validation,
  validateRequest,
  createNewTickets
);
export { router as createNewTicketsRouter };
