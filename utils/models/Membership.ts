// Membership.ts
import mongoose from 'mongoose';

const MembershipSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  
  role: { 
    type: String, 
    enum: ['owner', 'manager'], 
    required: true 
  },
});

// A user can only have one role per branch
MembershipSchema.index({ userId: 1, businessId: 1 }, { unique: true });

export default mongoose.models.Membership || mongoose.model('Membership', MembershipSchema);