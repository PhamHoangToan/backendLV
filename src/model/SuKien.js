import mongoose from 'mongoose';

const suKienSchema = new mongoose.Schema({
    tenSuKien: String,
    ngayBatDau: Date,
    ngayKetThuc: Date,
    noiDung: String,
    thanhPhoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ThanhPho',
        required: true
    }
}, { timestamps: true });

export const SuKien = mongoose.model('SuKien', suKienSchema);
