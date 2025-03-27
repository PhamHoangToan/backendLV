const datVeSchema = new mongoose.Schema({
    idKhachHang: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang' },
    idChuyenBay: { type: mongoose.Schema.Types.ObjectId, ref: 'ChuyenBay' },
    ngayDatVe: Date,
    hangGhe: String,
    tongTien: Number,
    trangThai: String
}, { timestamps: true });

export const DatVe = mongoose.model('DatVe', datVeSchema);