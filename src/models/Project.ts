import mongoose, { Schema, Document } from 'mongoose';

export interface INode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    mediaId?: string;
    mediaType?: string;
    text?: string;
    choices?: Array<{
      id: string;
      text: string;
      style?: Record<string, string>;
    }>;
  };
}

export interface IEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface IProject extends Document {
  projectId: string;
  userId: string;
  title: string;
  description?: string;
  nodes: INode[];
  edges: IEdge[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}

const ProjectSchema: Schema = new Schema({
  projectId: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  nodes: [{
    id: String,
    type: String,
    position: {
      x: Number,
      y: Number
    },
    data: {
      mediaId: String,
      mediaType: String,
      text: String,
      choices: [{
        id: String,
        text: String,
        style: Schema.Types.Mixed
      }]
    }
  }],
  edges: [{
    id: String,
    source: String,
    target: String,
    sourceHandle: String,
    targetHandle: String
  }],
  isPublic: { type: Boolean, default: false },
  tags: [String]
}, {
  timestamps: true
});

export default mongoose.model<IProject>('Project', ProjectSchema);
