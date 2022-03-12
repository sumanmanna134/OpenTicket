import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/userSchema';
import { NotFoundError } from '../errors/not-found-error';
import { currentUser } from '../middleware/current-user';
import { requireAuth } from '../middleware/require-auth';
import { BadRequestError } from '../errors/bad-request-error';

const router = express.Router();

const deleteProfile = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.currentUser?.email });

  if (!user) {
    throw new BadRequestError("Profile doesn't not exist! or already deleted!");
  }
  await User.deleteOne()
    .then((val) => {
      req.session = null;
      res.status(200).json({ message: 'Profile Deleted!' });
    })
    .catch((err) => {
      throw new Error(err);
    });
};

router.delete('/api/users/profile', currentUser, requireAuth, deleteProfile);
export { router as deleteProfileRouter };
