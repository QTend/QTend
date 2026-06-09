import mongoose, { Schema, Document, model, models } from 'mongoose';

// 1. TypeScript Interfaces
export interface IOrderItem {
  _id?: string; // Original item ID from the cart
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  branchId: mongoose.Types.ObjectId | string;
  orderNumber: string;
  tableNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'Active' | 'Completed';
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schemas
const OrderItemSchema = new Schema<IOrderItem>({
  _id: { type: String }, // Optional: reference to the original MenuItem _id
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const OrderSchema = new Schema<IOrder>(
  {
    branchId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Branch', 
        required: true 
    },
    // The human-readable ID (e.g., "ORD-12345")
    orderNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    tableNumber: { 
        type: String, 
        required: true 
    },
    // The array of food items they ordered
    items: { 
        type: [OrderItemSchema], 
        required: true 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    // We strictly limit this to our two MVP statuses
    status: { 
        type: String, 
        enum: ['Active', 'Completed'], 
        default: 'Active' 
    },
    specialInstructions: { 
        type: String,
        default: ''
    }
  },
  { 
      timestamps: true 
  }
);

// 3. Export the Model
export default mongoose.models.Order || mongoose.model('Order', OrderSchema);