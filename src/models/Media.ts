import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaMetadata {
  type: 'video' | 'image' | 'audio' | 'pov';
  mimeType: string;
  name: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  tags: string[];
}

export interface IMedia extends Document {
  mediaId: string;
  userId: string;
  metadata: IMediaMetadata;
  file: {
    data: Buffer;
    contentType: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema: Schema = new Schema({
  mediaId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  metadata: {
    type: { type: String, enum: ['video', 'image', 'audio', 'pov'], required: true },
    mimeType: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    dimensions: {
      width: Number,
      height: Number
    },
    duration: Number,
    tags: [String]
  },
  file: {
    data: Buffer,
    contentType: String
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des recherches
MediaSchema.index({ mediaId: 1, userId: 1 });
MediaSchema.index({ 'metadata.tags': 1 });

export default mongoose.model<IMedia>('Media', MediaSchema);
