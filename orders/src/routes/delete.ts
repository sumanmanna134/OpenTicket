import {
  currentUser,
  NotFoundError,
  requireAuth,
  UnAuthorizedError,
} from '@offlix-org/common';
import express, { Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/order-cancelled-publisher';
import { Order, OrderStatus } from '../models/order';
import { natsWrapper } from '../nats-wrapper';
const router = express.Router();
const deleteOrders = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const order = await Order.findById(orderId);
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new UnAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
    status: order.status,
  });
  res.status(204).send(order);
};
router.delete('/api/orders/:orderId', currentUser, requireAuth, deleteOrders);
export { router as deleteOrderRouter };
