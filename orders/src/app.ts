import express, { NextFunction } from 'express';
import { json } from 'body-parser';

import { NotFoundError } from '@offlix-org/common';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { healthRouter } from './routes/health';
import { indexOrderRouter } from './routes';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { deleteOrderRouter } from './routes/delete';

const app = express();
app.use(json());
app.set('trust proxy', true); // traffice is being proxied to the application through ingress controller
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);

app.use(healthRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (res, req, next) => {
  throw new NotFoundError();
});
export { app };
