const mongoose = require('mongoose');

const chiTietDonDatPhongSchema = new mongoose.Schema({
    idCCDDP:String,
    songay: { type: Number, required: true },
    soluongphong: { type: Number, required: true },
    tien: { type: Number, required: true },
    idLp: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'LoaiPhong', 
        required: true 
    },
    idDDP: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'DonDatPhong', 
        required: true 
    },
}, { timestamps: true });

export const ChiTietDonDatPhong = mongoose.model('ChiTietDonDatPhong', chiTietDonDatPhongSchema);
