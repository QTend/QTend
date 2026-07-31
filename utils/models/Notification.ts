import mongoose, { Schema, models } from "mongoose";

const NotificationSchema = new Schema(
    {
        branchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch", 
            required: true,
            index: true // 🚀 NEW: Critical for read performance
        },
        title: {
            type: String,
            required: true, // e.g., "Waiter Requested"
        },
        message: {
            type: String,
            required: true, // e.g., "Table 5 needs assistance."
        },
        type: {
            type: String,
            enum: ['Waiter_Call', 'Order_Completed', 'System_Alert'],
            required: true,
        },
        referenceId: {
            // Ties the notification to a specific order or table for clickable routing
            type: mongoose.Schema.Types.ObjectId,
            required: false,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        createdAt: { 
            type: Date, 
            default: Date.now,
            expires: '7d' // 🧹 MongoDB's automated garbage collector
        }
    }
);

export default models.Notification || mongoose.model('Notification', NotificationSchema);