import express, { Request, Response, NextFunction } from 'express';
import { requireAuth } from '@offlix-org/common';
import 'express-async-errors';
import { body } from 'express-validator';
import { currentUser } from '@offlix-org/common';
import { User } from '../models/userSchema';
import { NotFoundError } from '@offlix-org/common';

const router = express.Router();

const updateProfile = async (req: Request, res: Response) => {
  if (typeof req.body.avatar !== 'undefined') {
    throw new Error('Can not change Avatar at this moment!');
  }
  let user = await User.findById(req.currentUser?.id);
  if (!user) {
    throw new NotFoundError();
  }

  await User.findByIdAndUpdate(req.currentUser?.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })
    .then((val) =>
      res.status(200).send({ message: 'Profile has been Updated successfully' })
    )
    .catch((err) => {
      throw new Error(err);
    });
};

router.put('/api/users/profile', currentUser, requireAuth, updateProfile);
export { router as updateProfileRouter };
