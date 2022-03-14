import express from 'express';
import { currentUser } from '@offlix-org/common';
import { requireAuth } from '@offlix-org/common';
const router = express();

router.post('/api/users/signout', currentUser, requireAuth, (req, res) => {
  req.session = null;

  res.status(200).send({ message: 'Logout successfully!' });
});

export { router as signoutRouter };
