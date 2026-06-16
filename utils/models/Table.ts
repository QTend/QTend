import mongoose, { Schema, Document, models } from 'mongoose';

export interface ITable extends Document {
  branchId: mongoose.Types.ObjectId;
  name: string;      // We use 'name' instead of 'number' since it's a string (e.g., "10" or "Pool-A")
  qrLink: string;    // The full URL for the QR code
  isActive: boolean; // For soft-deleting or temporarily closing tables
  zoneId?: mongoose.Types.ObjectId; // Optional: The blank slot for your future hotel/zone update!
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema = new Schema<ITable>(
  {
    branchId: {
      type: Schema.Types.ObjectId,
      ref: 'Branch',
      required: [true, 'Branch ID is required'],
      index: true, // Super important! Makes finding tables for a branch lightning fast
    },
    name: {
      type: String,
      required: [true, 'Table name/number is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    zoneId: {
      type: Schema.Types.ObjectId,
      ref: 'Zone', // Doesn't matter that the Zone model doesn't exist yet!
      default: null,
    },
  },
  { timestamps: true }
);

// This ensures a restaurant can't accidentally create two "Table 4"s for the same branch
TableSchema.index({ branchId: 1, name: 1 }, { unique: true });

const Table = models.Table || mongoose.model<ITable>('Table', TableSchema);

export default Table;