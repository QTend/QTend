import mongoose, { Schema } from 'mongoose';

// 1. TypeScript Interfaces
export interface IOrderItem {
  _id?: string; 
  name: string;
  price: number;
  quantity: number;
  zoneId: mongoose.Types.ObjectId | string; // Routes to Bar/Grill
  itemStatus: 'Pending' | 'Preparing' | 'Ready'; // Lets Bar/Grill mark their specific item ready
}

export interface IOrder {
  branchId: mongoose.Types.ObjectId | string;
  orderNumber: string;
  tableNumber: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'Active' | 'Completed'; // Overall physical status
  paymentStatus: 'Paid' | 'Unpaid'; // Did the Admin collect the cash?
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Mongoose Schemas
const OrderItemSchema = new Schema<IOrderItem>({
  _id: { type: String }, 
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  zoneId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Zone', 
    required: true 
  },
  itemStatus: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Ready'], 
    default: 'Pending' 
  }
});

const OrderSchema = new Schema<IOrder>(
  {
    branchId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Branch', 
        required: true,
        index: true
    },
    orderNumber: { 
        type: String, 
        required: true, 
        unique: true 
    },
    tableNumber: { 
        type: String, 
        required: true 
    },
    items: { 
        type: [OrderItemSchema], 
        required: true 
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Active', 'Completed'], 
        default: 'Active' 
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
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

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);