import express from 'express';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { UnAuthorizedError } from '../errors/unauthorize-error';
import { currentUser } from '../middleware/current-user';
import { requireAuth } from '../middleware/require-auth';
const router = express();

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
  res.send({ currentUser: req.currentUser });
});

export { router as currentUserRouter };
