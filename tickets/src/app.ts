import express, { NextFunction } from 'express';
import { json } from 'body-parser';

import { NotFoundError } from '@offlix-org/common';
import 'express-async-errors';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import { greetRouter } from './routes/greet';
import { createNewTicketsRouter } from './routes/new_tickets';
import { showTicketRouter } from './routes/show-ticketbyId';
import { showAllTicketRouter } from './routes/show-all-tickets';
import { updateTicketRouter } from './routes/update';
import { deleteTicketRouter } from './routes/delete';

const app = express();
app.use(json());
app.set('trust proxy', true); // traffice is being proxied to the application through ingress controller
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== 'test' })
);

app.use(greetRouter);
app.use(createNewTicketsRouter);
app.use(showTicketRouter);
app.use(showAllTicketRouter);
app.use(updateTicketRouter);
app.use(deleteTicketRouter);

app.all('*', async (res, req, next) => {
  throw new NotFoundError();
});
export { app };
