const thanhToanSchema = new mongoose.Schema({
    idLoaiPhong: { type: mongoose.Schema.Types.ObjectId, ref: 'LoaiPhong' },
    idDatVe: { type: mongoose.Schema.Types.ObjectId, ref: 'DatVe' },
    tongTien: Number,
    phuongThuc: String,
    trangThai: String
}, { timestamps: true });

export const ThanhToan = mongoose.model('ThanhToan', thanhToanSchema);