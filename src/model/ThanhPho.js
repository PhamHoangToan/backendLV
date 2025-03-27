import mongoose from "mongoose";

const thanhPhoSchema = new mongoose.Schema(
    {
        tenThanhPho: { type: String, required: true },
        hinhAnh: { type: String, required: true }, // Store the image URL
    },
    { timestamps: true }
);

export const ThanhPho = mongoose.model("ThanhPho", thanhPhoSchema);
