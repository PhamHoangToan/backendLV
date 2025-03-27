import mongoose from 'mongoose';

const khachHangSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    cccd: String,
    ngaySinh: Date,
    sdt:String,
    idDatPhong: { type: mongoose.Schema.Types.ObjectId, ref: 'DonDatPhong' }
}, { timestamps: true });

export const KhachHang = mongoose.model('KhachHang', khachHangSchema);