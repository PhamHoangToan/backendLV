import mongoose from 'mongoose';

const KhachSanSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    tenKS: String,
    diaChi: String,
    wifi: Boolean,
    moTa: String,
    trangThai: String,
    startDate: Date,
    endDate: Date,
    hinhAnh: String,
    gia: {
        type: Number,
        required: true,  // Ensure it is always provided
        default: 0       // Or set a default if not provided
      },
    soPhong:Number,
    soSao:Number,
});

// Avoid overwriting the model if it's already compiled
const KhachSan = mongoose.models.KhachSan || mongoose.model('KhachSan', KhachSanSchema);

export { KhachSan };
