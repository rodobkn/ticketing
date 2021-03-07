import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  //This grab all the tickets which are not purchased/reserved inside the database
  const tickets = await Ticket.find({
    orderId: undefined
  });

  res.send(tickets);
});

export { router as indexTicketRouter };
