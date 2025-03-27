import { HangHangKhong } from "../model/HangHangKhong"; // Import the HangHangKhong model
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// Middleware for authenticating JWT token
export const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Register a new airline
export const registerHangHangKhong = async (req, res) => {
    try {
        const { email, password, tenHHk, diaChi, sdt, website, adminHHK } = req.body;

        if (!email || !password || !tenHHk) {
            return res.status(400).json({ message: "Email, password, and airline name are required." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const existingUser = await HangHangKhong.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newHangHangKhong = new HangHangKhong({
            email,
            password: hashedPassword,
            tenHHk,
            diaChi,
            sdt,
            website,
            adminHHK,
        });

        await newHangHangKhong.save();

        res.status(201).json({ message: "Airline registered successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login an airline admin
export const loginHangHangKhong = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const hangHangKhong = await HangHangKhong.findOne({ email });
        if (!hangHangKhong) {
            return res.status(404).json({ message: "Email not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, hangHangKhong.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        const token = jwt.sign(
            { id: hangHangKhong._id },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful.",
            token,
            hangHangKhong: {
                id: hangHangKhong._id,
                email: hangHangKhong.email,
                tenHHk: hangHangKhong.tenHHk,
                diaChi: hangHangKhong.diaChi,
                sdt: hangHangKhong.sdt,
                website: hangHangKhong.website,
                adminHHK: hangHangKhong.adminHHK,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get authenticated airline's profile
export const getAirlineProfile = async (req, res) => {
    try {
        const { id } = req.user;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const userProfile = await HangHangKhong.findById(id);
        if (!userProfile) {
            return res.status(404).json({ message: "Airline not found." });
        }

        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CRUD Operations for HangHangKhong
export const getAllHangHangKhong = async (req, res) => {
    try {
        const data = await HangHangKhong.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getHangHangKhongById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        const data = await HangHangKhong.findById(id);
        if (!data) return res.status(404).json({ message: "Airline not found." });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addHangHangKhong = async (req, res) => {
    try {
        const data = new HangHangKhong(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateHangHangKhong = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra xem idHHK có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data provided for update." });
        }

        const data = await HangHangKhong.findByIdAndUpdate(id, req.body, { new: true });

        if (!data) {
            return res.status(404).json({ message: "Airline not found." });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteHangHangKhong = async (req, res) => {
    const { id } = req.params;

    // Kiểm tra xem idHHK có phải là ObjectId hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        const data = await HangHangKhong.findByIdAndDelete(id);
        if (!data) {
            return res.status(404).json({ message: "Airline not found." });
        }

        res.json({ message: "Airline deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};