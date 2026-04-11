import mongoose from 'mongoose';

const MenuTypeSchema = new mongoose.Schema({
  branchId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Branch', 
    required: true 
  },
  // Relational Link: Belongs to a specific Category
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MenuCategory', 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true // e.g., "Swallow", "Alcoholic Beverages"
  },
}, { timestamps: true });

export default mongoose.models.MenuType || mongoose.model('MenuType', MenuTypeSchema);