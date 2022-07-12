import {
  BadRequestError,
  currentUser,
  NotFoundError,
  requireAuth,
  UnAuthorizedError,
} from '@offlix-org/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
const router = express.Router();
const showOrders = async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new BadRequestError(
      "You don't have sufficient permission to access this resource"
    );
  }
  res.status(200).send(order);
};
router.get('/api/orders/:orderId', currentUser, requireAuth, showOrders);
export { router as showOrderRouter };
