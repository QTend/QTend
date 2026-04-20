import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema({
  branchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: true 
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MenuCategory', 
    required: true 
  },
  // typeId: { 
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'MenuType', 
  //   required: false 
  // },
  
  // The Item Details
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String,
    trim: true 
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  image: { 
    url: { type: String, default: "" },
    publicId: { type: String, default: "" }
  },
  isAvailable: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);