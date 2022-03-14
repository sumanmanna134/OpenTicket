import express from 'express';
import { currentUser } from '@offlix-org/common';
import { requireAuth } from '@offlix-org/common';
const router = express();

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
  res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };
