import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
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

    natsWrapper.client.on('connect', () => {
      new OrderCreatedListener(natsWrapper.client).listen();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (err) {
    console.log(err);
  }
};

start();
