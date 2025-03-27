import mongoose from 'mongoose';

// Sử dụng ObjectId cho idHHK để tận dụng tính năng ID tự động của MongoDB
const hangHangKhongSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true }, // Dùng ObjectId
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: { type: String, required: true },
    tenHHk: { type: String, required: true },
    diaChi: { type: String },
    sdt: { type: String, match: [/^\d{10,15}$/, 'Invalid phone number.'] },
    website: { type: String },
    adminHHK: { type: String }, // Có thể là tham chiếu đến một schema Admin nếu cần
}, { timestamps: true });

export const HangHangKhong = mongoose.model('HangHangKhong', hangHangKhongSchema);
