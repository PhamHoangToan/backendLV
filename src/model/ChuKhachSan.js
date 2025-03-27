import mongoose from 'mongoose';
const chuKhachSanSchema = new mongoose.Schema({
    id:String,
    email: String,
    matKhau: String,
    hoten:String,
    cccd: String,
    ngaySinh: Date,
    sdt: String,
    adminKs:String
}, { timestamps: true });

export const ChuKhachSan = mongoose.model('ChuKhachSan', chuKhachSanSchema);