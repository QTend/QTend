import mongoose from 'mongoose';

const ZoneSchema = new mongoose.Schema({
    branchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch', 
        required: true,
        index: true
    },
    name: { 
        type: String, 
        required: true,
        trim: true 
    },
    isActive: { 
        type: Boolean, 
        default: true 
    }
}, { timestamps: true });

export default mongoose.models.Zone || mongoose.model('Zone', ZoneSchema);