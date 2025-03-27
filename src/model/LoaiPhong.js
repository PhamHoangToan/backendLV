import mongoose from 'mongoose';

const loaiPhongSchema = new mongoose.Schema({
    TenLp: { type: String, required: true },
    mayLanh: { type: Boolean, required: true },
    hinhAnhphong: { type: String },
    gia: { type: Number, required: true },
    soLuongGiuong: { type: Number, required: true },
    soLuongPhong: { type: Number, required: true },
    idks: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachSan', required: true },
    ngayNhanPhong: { type: Date, required: true },
    ngayTraPhong: { type: Date, required: true },
    availableDates: [{ type: Date }] // ➡️ THÊM TRƯỜNG NÀY!
  });
  

const LoaiPhong = mongoose.models.LoaiPhong || mongoose.model('LoaiPhong', loaiPhongSchema);

export default LoaiPhong;
