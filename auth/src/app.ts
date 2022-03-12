import express, { NextFunction } from 'express';
import { json } from 'body-parser';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { updateProfileRouter } from './routes/update-profile';
import { deleteProfileRouter } from './routes/delete-profile';
import { getProfileRouter } from './routes/get-profile';

const app = express();
app.use(json());
app.set('trust proxy', true); // traffice is being proxied to the application through ingress controller
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(updateProfileRouter);
app.use(deleteProfileRouter);
app.use(getProfileRouter);

app.all('*', async (res, req, next) => {
  throw new NotFoundError();
});
export { app };
