import { Schema, Model, model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface RandomDoc extends Document {
  title: string;
  createdBy: string;
  version: number;
}

interface RandomModel extends Model<RandomDoc> {
  title: string;
  createdBy: string;
}

const randomSchema = new Schema(
  {
    title: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true, toJSON: { getters: true } }
);

randomSchema.set('versionKey', 'version');
randomSchema.plugin(updateIfCurrentPlugin);

const Random = model<RandomDoc, RandomModel>('random', randomSchema);
export { Random };
