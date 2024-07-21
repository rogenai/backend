import mongoose, { Document, Schema } from 'mongoose';


export interface IEntity {
  x: number;
  y: number;
  type: string;
}

export interface ILevel extends Document {
  name: string;
  difficulty: string;
  entities: IEntity[];
}

const EntitySchema = new Schema({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  type: { type: String, required: true }
});

const LevelSchema: Schema = new Schema({
  name: { type: String, required: true },
  difficulty: { type: String, required: true },
  entities: [EntitySchema]
});

export default mongoose.model<ILevel>('Level', LevelSchema);