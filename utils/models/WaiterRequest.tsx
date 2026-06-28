import mongoose, { Schema, Document } from 'mongoose';

export interface IWaiterRequest extends Document {
  branchId: string;
  tableNumber: string;
  requestType: string;
  status: 'Pending' | 'Resolved';
  createdAt: Date;
}

const WaiterRequestSchema = new Schema<IWaiterRequest>(
  {
    branchId: { 
      type: String, 
      required: true, 
      index: true
    },
    tableNumber: { 
      type: String, 
      required: true 
    },
    requestType: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['Pending', 'Resolved'], 
      default: 'Pending' 
    },
  },
  { timestamps: true }
);

// Prevent Next.js from recompiling the model every time you save a file
const WaiterRequest = mongoose.models.WaiterRequest || mongoose.model<IWaiterRequest>('WaiterRequest', WaiterRequestSchema);

export default WaiterRequest;