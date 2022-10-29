import { natsWraper } from '@adwesh/common';
import mongoose from 'mongoose';

import { app } from './app';
import { UserCreatedListener } from './events/UserCreatedListener';

if (!process.env.JWT_KEY) {
  throw new Error('JWT is not defined!');
}

if (!process.env.MONGO_URI) {
  throw new Error('MONGO URI is not defined!');
}

if (!process.env.NATS_CLUSTER_ID) {
  throw new Error('NATS_CLUSTER_ID must be defined');
}

if (!process.env.NATS_CLIENT_ID) {
  throw new Error('NATS_CLIENT_ID must be defined');
}

if (!process.env.NATS_URI) {
  throw new Error('NATS_URI must be defined');
}

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    await natsWraper.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URI!
    );
    natsWraper.client.on('close', () => {
      console.log('NATS shutting down . . .');
      process.exit();
    });
    await new UserCreatedListener(natsWraper.client).listen();
    process.on('SIGINT', () => natsWraper.client.close());
    process.on('SIGTERM', () => natsWraper.client.close());
    app.listen(5001);
    console.log('Connected to Random Service, listening on PORT: 5001');
  } catch (error) {
    console.log(error);
  }
};

start();
