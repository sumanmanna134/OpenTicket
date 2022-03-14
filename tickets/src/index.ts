import mongoose from 'mongoose';
import { app } from './app';
import { errorHandler } from '@offlix-org/common';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO URI Not defined!');
  }

  try {
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
