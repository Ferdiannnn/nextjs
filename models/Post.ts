import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    author: {
      type: String,
      default: 'Anonymous',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
