import mongoose from 'mongoose';
import { ITask } from '../interfaces/task.interface';

const taskSchema = new mongoose.Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    deadline: {
      type: Date,
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    remainderEmail: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Task = mongoose.model('Task', taskSchema);
