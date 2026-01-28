import mongoose, { Schema, Document } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  description?: string;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AlbumSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      default: '',
    },
    imageUrls: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema);
