import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['farmer', 'admin'],
      default: 'farmer'
    },
    farmDetails: {
      landSizeAcres: Number,
      primaryCrop: String,
      district: String,
      state: String
    },
    savedAddress: {
      address: String,
      village: String,
      district: String,
      state: String,
      pincode: String
    }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
