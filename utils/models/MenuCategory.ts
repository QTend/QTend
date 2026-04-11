import mongoose from 'mongoose';

const MenuCategorySchema = new mongoose.Schema({
  // B2B Protection: Links this category specifically to one branch
  branchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true // e.g., "Food", "Drinks"
  },
  isAvailable: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

export default mongoose.models.MenuCategory || mongoose.model('MenuCategory', MenuCategorySchema);