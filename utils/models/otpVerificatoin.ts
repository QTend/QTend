import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum : ['emailVerification', 'forgotPassword'],
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 600 
    }
})

export default mongoose.models.OtpVerification || mongoose.model("OtpVerification", OtpSchema);