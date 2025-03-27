import mongoose from 'mongoose';
import { ThanhPho } from "../model/ThanhPho.js";
import multer from "multer";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "_" + file.originalname;
        cb(null, uniqueName);
    }
});
export const upload = multer({ storage: storage });

export const getAllThanhPho = async (req, res) => {
    try {
        const data = await ThanhPho.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getThanhPhoById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        const data = await ThanhPho.findById(id);
        if (!data) return res.status(404).json({ message: "City not found." });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addThanhPho = async (req, res) => {
    try {
        const { tenThanhPho } = req.body;
        if (!tenThanhPho) {
            return res.status(400).json({ message: "City name is required." });
        }

        const hinhAnh = req.file ? req.file.filename : "";
        if (!hinhAnh) {
            return res.status(400).json({ message: "City image is required." });
        }

        const thanhPho = new ThanhPho({
            tenThanhPho,
            hinhAnh
        });

        await thanhPho.save();

        res.status(201).json({
            message: "City added successfully",
            data: thanhPho
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateThanhPho = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        const updateData = { ...req.body };

        if (req.file) {
            updateData.hinhAnh = req.file.filename;
        }

        const data = await ThanhPho.findByIdAndUpdate(id, updateData, { new: true });

        if (!data) {
            return res.status(404).json({ message: "City not found." });
        }

        res.json({
            message: "City updated successfully",
            data: data
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteThanhPho = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        const data = await ThanhPho.findByIdAndDelete(id);
        if (!data) return res.status(404).json({ message: "City not found." });

        res.json({ message: "City deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
