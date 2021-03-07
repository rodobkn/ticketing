import express, { Request, Response } from 'express';
import { requireAuth } from '@rmltickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
  //We are grabbing all the orders of the current user.
  const orders = await Order.find({
    userId: req.currentUser!.id,
  }).populate('ticket'); // Besides we added the ticket fields with the method 'populate()'

  res.send(orders);
});

export { router as indexOrderRouter };
