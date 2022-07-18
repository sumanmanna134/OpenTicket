import express, { NextFunction } from 'express';
import { json } from 'body-parser';

import { NotFoundError } from '@offlix-org/common';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

const app = express();
app.use(json());
app.set('trust proxy', true); // traffice is being proxied to the application through ingress controller
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);

app.all('*', async (res, req, next) => {
  throw new NotFoundError();
});
export { app };
