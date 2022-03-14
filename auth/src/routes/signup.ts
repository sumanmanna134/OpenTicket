import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User, UserDoc } from '../models/userSchema';
import 'express-async-errors'; // async error handler
import jwt from 'jsonwebtoken';
import { BadRequestError } from '@offlix-org/common';
import { ApiConstant } from '../constant/constant';
import { validateRequest } from '@offlix-org/common';
const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('name').trim().isLength({ min: 3 }).withMessage('Enter Valid name'),
    body('phone')
      .isMobilePhone('en-IN')
      .trim()
      .isLength({ min: 10, max: 10 })
      .withMessage('Invalid Phone Number'),
    body('email').isEmail().withMessage(ApiConstant.INVALID_EMAIL),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage(ApiConstant.INVALID_PASSWORD),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phone, email, password } = req.body;
    const existingUser = await User.findOne({ email, phone });
    if (existingUser) {
      throw new BadRequestError(ApiConstant.EMAIL_ALREADY_INUSE);
    }

    const user = User.build({
      name,
      phone,
      email,
      password,
      avatar: getAvatarByName(name),
    });
    await user
      .save()
      .then((user) => {
        setJwtToken(user, req), res.status(201).send(user);
      })
      .catch((err) => {
        throw new BadRequestError(ApiConstant.ACCOUNT_CREATION_FAILED);
      });
  }
);

const setJwtToken = (user: UserDoc, req: Request) => {
  const userJwt = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_KEY!
  );

  req.session = {
    jwt: userJwt,
  };
};

const getAvatarByName = (name: string) => {
  const modifiedName = name.split(' ').join('%20');
  return `https://avatars.dicebear.com/api/initials/:${modifiedName}.svg`;
};

export { router as signupRouter, setJwtToken };
