import mongoose from 'mongoose';

const DonDatPhongSchema = new mongoose.Schema({
  IdDdp: {
    type: String,
    unique: true, // 👈 Đảm bảo duy nhất
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachHang', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'KhachSan', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoaiPhong', required: true },
  roomType: { type: String, required: true },
  numberOfRooms: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, required: true }, // 'credit_card', 'e_wallet', 'cash'
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  ngayDuyet: { type: Date },
  ghiChu: { type: String }
}, { timestamps: true });

export const DonDatPhong = mongoose.model('DonDatPhong', DonDatPhongSchema);
export default DonDatPhong;