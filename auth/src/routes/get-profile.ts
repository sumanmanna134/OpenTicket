import express, { Request, Response, NextFunction } from 'express';
import { requireAuth } from '@offlix-org/common';
import 'express-async-errors';
import { currentUser } from '@offlix-org/common';
import { User } from '../models/userSchema';

const router = express.Router();

const getProfile = async (req: Request, res: Response) => {
  const email = req.currentUser?.email;
  let user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    console.log('j');
    throw new Error(`${email} not found!`);
  }

  await User.findById(req.currentUser?.id)
    .then((profile) => res.status(200).send(profile))
    .catch((err) => {
      throw new Error(err);
    });
};

router.get('/api/users/profile', currentUser, requireAuth, getProfile);
export { router as getProfileRouter };
