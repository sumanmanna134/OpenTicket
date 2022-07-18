import {
  BadRequestError,
  currentUser,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@offlix-org/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/order-created-publisher';
import { OrderCancelledPublisher } from '../events/order-cancelled-publisher';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 3 * 60;

/**
 *
 * @param req accepts REQUEST
 * @param res retrieve all active orders for the given user making the request.
 */
const newOrders = async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  //find the ticket the user is trying to order in the database
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new NotFoundError();
  }

  // make sure that this ticket already reserved
  // Run query to look at all orders. find an order where the ticket
  // is the ticket we just found *and* the orders status is *not* cancelled.
  // It we find an order from that means the ticket *is* reserved.

  const isReserved = await ticket.isReserved();

  if (isReserved) {
    throw new BadRequestError('Ticket is already reserved');
  }

  //calculate an expiration Date for this order
  try {
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    //publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: OrderStatus.Created,
      version: order.version,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
    res.status(201).send(order);
  } catch (e) {
    throw new Error('Order has been failed to create!');
  }
};

const validation = [
  body('ticketId')
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided'),
];
router.post(
  '/api/orders',
  currentUser,
  requireAuth,
  validation,
  validateRequest,
  newOrders
);
export { router as newOrderRouter };
