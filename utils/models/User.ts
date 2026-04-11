import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { 
        type: String, 
        required: true 
    },
    plans: {
        planType: { type: String, enum: ['free', 'lite', 'pro'], default: 'free' },
        status: { type: String, enum: ['inactive', 'active', 'expired'], default: 'inactive' },
        maxBranches: { type: Number, default: 1 },
        expiryDate: { type: Date }
    },
    isFoundingMember: {
        type: Boolean,
        default: false
    }
},
{timestamps: true}
);


export default mongoose.models.User || mongoose.model('User', UserSchema);