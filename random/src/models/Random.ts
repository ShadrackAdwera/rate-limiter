import { Schema, Model, model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface RandomDoc extends Document {
  title: string;
  createdBy: string;
  version: number;
}

interface RandomModel extends Model<RandomDoc> {
  title: string;
  createdBy: string;
}

export interface UserDoc extends Document {
  email: string;
  version: number;
}

interface UserModel extends Model<UserDoc> {
  email: string;
}

const randomSchema = new Schema(
  {
    title: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, toJSON: { getters: true } }
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true, toJSON: { getters: true } }
);

randomSchema.set('versionKey', 'version');
userSchema.set('versionKey', 'version');
randomSchema.plugin(updateIfCurrentPlugin);
userSchema.plugin(updateIfCurrentPlugin);

const Random = model<RandomDoc, RandomModel>('random', randomSchema);
const User = model<UserDoc, UserModel>('user', userSchema);
export { Random, User };
