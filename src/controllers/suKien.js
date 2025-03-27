import mongoose from "mongoose";
import { SuKien } from "../model/SuKien"


export const getAllSuKien = async (req, res) => {
    try {
        const suKiens = await SuKien.find().populate('thanhPhoId', 'tenThanhPho');
        res.status(200).json(suKiens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getSuKienById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        const suKien = await SuKien.findById(id).populate('thanhPhoId', 'tenThanhPho');
        if (!suKien) return res.status(404).json({ message: "Event not found." });

        res.status(200).json(suKien);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const addSuKien = async (req, res) => {
    try {
        const { tenSuKien, ngayBatDau, ngayKetThuc, noiDung, thanhPhoId } = req.body;

        if (!tenSuKien || !ngayBatDau || !ngayKetThuc || !noiDung || !thanhPhoId) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!mongoose.Types.ObjectId.isValid(thanhPhoId)) {
            return res.status(400).json({ message: "Invalid thanhPhoId format." });
        }

        const newSuKien = new SuKien({
            tenSuKien,
            ngayBatDau,
            ngayKetThuc,
            noiDung,
            thanhPhoId
        });

        await newSuKien.save();
        res.status(201).json(newSuKien);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



export const updateSuKien = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        const { thanhPhoId } = req.body;

        if (thanhPhoId && !mongoose.Types.ObjectId.isValid(thanhPhoId)) {
            return res.status(400).json({ message: "Invalid thanhPhoId format." });
        }

        const updatedSuKien = await SuKien.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedSuKien) return res.status(404).json({ message: "Event not found." });

        res.status(200).json(updatedSuKien);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSuKien = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        const deletedSuKien = await SuKien.findByIdAndDelete(id);
        if (!deletedSuKien) return res.status(404).json({ message: "Event not found." });

        res.status(200).json({ message: "Event deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getSuKienByThanhPhoId = async (req, res) => {
    try {
        const { thanhPhoId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(thanhPhoId)) {
            return res.status(400).json({ message: "Invalid thanhPhoId format." });
        }

        const suKiens = await SuKien.find({ thanhPhoId }).populate('thanhPhoId', 'tenThanhPho');

        if (suKiens.length === 0) {
            return res.status(404).json({ message: "No events found for this city." });
        }

        res.status(200).json(suKiens);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
