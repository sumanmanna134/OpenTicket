import { currentUser, requireAuth } from '@offlix-org/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';
const router = express.Router();
const indexOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({
    userId: req.currentUser!.id,
  });
  res.send(orders);
};
router.get('/api/orders', currentUser, requireAuth, indexOrders);
export { router as indexOrderRouter };
