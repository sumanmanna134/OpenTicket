import express from 'express';
import { Request, Response } from 'express';
import { User } from '../models/userSchema';
import 'express-async-errors';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validate-request';
import { BadRequestError } from '../errors/bad-request-error';
import { Password } from '../services/password';
import { setJwtToken } from './signup';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid!'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password!'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError(
        `${email} doesn't exist or Invalid Email address`
      );
    }
    const isPasswordMatched = await Password.compare(
      existingUser.password,
      password
    );
    if (!isPasswordMatched) {
      throw new BadRequestError('Invalid Credentials!');
    }
    await User.findByIdAndUpdate(existingUser.id, { lastLoginAt: Date.now() })
      .then((value) => {
        setJwtToken(existingUser, req);

        res.status(200).send(existingUser);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }
);

export { router as signinRouter };
