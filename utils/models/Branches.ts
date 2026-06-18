import mongoose from 'mongoose';

const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    website: {
        type: String,
        trim: true,
        default: ''
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminCategory',
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    location: {
        address: { 
            type: String, 
            required: true
        },
        state: { type: String },
        city: { type: String },
        country: { type: String },
        postalCode: { type: String }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    socials: {
        instagram: { type: String, default: "" },
        x: { type: String, default: "" },
        tiktok: { type: String, default: "" }
    },
    logo: { 
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
    },
}, 
{ timestamps: true }
);

export default mongoose.models.Branch || mongoose.model('Branch', BranchSchema);