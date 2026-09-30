import mongoose, { Schema, Document } from 'mongoose';

export interface IPushSubscription extends Document {
  branchId: mongoose.Types.ObjectId;
  zoneId?: mongoose.Types.ObjectId; // Optional: Present for Kitchen stations, null for Managers
  subscription: {
    endpoint: string;
    expirationTime?: number | null;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  createdAt: Date;
}

const PushSubscriptionSchema = new Schema<IPushSubscription>({
  branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
  zoneId: { type: Schema.Types.ObjectId, ref: 'Zone', index: true },
  subscription: {
    endpoint: { type: String, required: true, unique: true },
    expirationTime: { type: Number, default: null },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  createdAt: { type: Date, default: Date.now },
});

// Compound index so reads filtering by branch and zone are instant
PushSubscriptionSchema.index({ branchId: 1, zoneId: 1 });

export default mongoose.models.PushSubscription || 
  mongoose.model<IPushSubscription>('PushSubscription', PushSubscriptionSchema);