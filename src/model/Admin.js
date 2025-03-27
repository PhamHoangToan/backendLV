import mongoose from 'mongoose';

// Check if the Admin model is already defined to avoid overwriting it
const AdminSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    matKhau: { type: String, required: true },
    hoten: { type: String, required: true },
  },
  { timestamps: true }
);

// Use mongoose.models to check if the model is already registered
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

export { Admin };
