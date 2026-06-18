import mongoose from 'mongoose';

const AdminCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Prevents Next.js fast-refresh from compiling the model multiple times
export default mongoose.models.AdminCategory || mongoose.model('AdminCategory', AdminCategorySchema);
