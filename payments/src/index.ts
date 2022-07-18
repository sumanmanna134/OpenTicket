import mongoose from 'mongoose';
import { app } from './app';
import { errorHandler } from '@offlix-org/common';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO URI Not defined!');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS URL must be defined!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS CLUSTER ID must be defined!');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS CLIENT ID must be defined!');
  }

  try {
    natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    natsWrapper.client.on('connect', () => {
      console.log('Connection received.. NATS SERVER');
    });
    await mongoose.connect(process.env.MONGO_URI).then(() => {
      console.log('MongoDB connected ( TICKETS) !!');
    });
  } catch (err) {
    console.log(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!!-');
});
app.use(errorHandler);
start();
