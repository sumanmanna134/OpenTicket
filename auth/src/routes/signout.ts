import express from 'express';
import { BadRequestError } from '../errors/bad-request-error';
import { currentUser } from '../middleware/current-user';
import { requireAuth } from '../middleware/require-auth';
const router = express();

router.post('/api/users/signout', currentUser, requireAuth, (req, res) => {
  req.session = null;

  res.status(200).send({ message: 'Logout successfully!' });
});

export { router as signoutRouter };
