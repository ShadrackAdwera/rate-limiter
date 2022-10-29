import { HttpError } from '@adwesh/common';
import { Listener, Subjects, UserCreatedEvent } from '@adwesh/v2-common';
import { Message } from 'node-nats-streaming';
import { UserDoc, User } from '../models/Random';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName: string = 'random-service';
  async onMessage(
    data: { id: string; email: string; category: string },
    msg: Message
  ): Promise<void> {
    let foundUser: (UserDoc & { _id: string }) | null;

    try {
      foundUser = await User.findOne({ email: data.email });
    } catch (error) {
      throw new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      );
    }

    if (foundUser) msg.ack();

    const newUser = new User({ _id: data.id, email: data.email });

    try {
      await newUser.save();
      msg.ack();
    } catch (error) {
      throw new HttpError(
        error instanceof Error ? error.message : 'An error occured',
        500
      );
    }
  }
}
