import { Document, Schema, Model, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface UserDoc extends Document {
  email: string;
  password: string;
  version: number;
}

export interface UserModel extends Model<UserDoc> {
  email: string;
  password: string;
}

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, toJSON: { getters: true } }
);

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

const User = model<UserDoc, UserModel>('user', userSchema);
export { User };
