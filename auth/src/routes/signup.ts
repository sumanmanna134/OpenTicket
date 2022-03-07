import express, { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-errors';
import { User } from '../models/userSchema';
import 'express-async-errors'; // async error handler
import { BadRequestError } from '../errors/bad-request-error';
import { ApiConstant } from '../constant/constant';
const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage(ApiConstant.INVALID_EMAIL),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage(ApiConstant.INVALID_PASSWORD),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError(ApiConstant.EMAIL_ALREADY_INUSE);
    }

    const user = User.build({ email, password });
    await user
      .save()
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        throw new BadRequestError(ApiConstant.ACCOUNT_CREATION_FAILED);
      });
  }
);

export { router as signupRouter };
