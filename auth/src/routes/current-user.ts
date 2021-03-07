import express from 'express';

import { currentUser } from '@rmltickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  //Si req.currentUser es undefined, enviará null.
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
