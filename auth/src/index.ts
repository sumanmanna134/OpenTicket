import mongoose from 'mongoose';
import { app } from './app';
import { errorHandler } from './middleware/error-handler';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined!');
  }
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth').then(() => {
      console.log('MongoDB connected !!');
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
