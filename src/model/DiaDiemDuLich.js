const mongoose = require('mongoose');

const diaDiemDuLichSchema = new mongoose.Schema({
    idDDDL:String,
    tenDDDL: { type: String, required: true },
    Diadiem: { type: String, required: true },
    Mota: { type: String },
    Giatien: { type: String },
    Thoigianhoatdong: { type: String },
    idTp: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'ThanhPho', 
        required: true 
    },
}, { timestamps: true });

export const DiaDiemDuLich = mongoose.model('DiaDiemDuLich', diaDiemDuLichSchema);
