const mongoose = require('mongoose');

const chuyenBaySchema = new mongoose.Schema({
    idCB:String,
    tenHangHL: { type: String, required: true },
    diemDi: { type: String, required: true },
    diemDen: { type: String, required: true },
    thoiGianKhoiHanh: { type: Date, required: true },
    thoiGianHaCanh: { type: Date, required: true },
    hinhAnhCb: { type: String },
    idHHK: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'HangHangKhong', 
        required: true 
    },
}, { timestamps: true });

export const ChuyenBay = mongoose.model('ChuyenBay', chuyenBaySchema);
