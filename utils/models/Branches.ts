import mongoose from 'mongoose';

const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    logo: {
        type: String,
    },
    tableCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, 
{timestamps: true}
)


export default mongoose.models.Branch || mongoose.model('Branch', BranchSchema);