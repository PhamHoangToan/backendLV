import { ChuKhachSan } from "../model/ChuKhachSan"; // Import the ChuKhachSan model
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
        req.user = decoded; // Attach user info to request
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Register a new ChuKhachSan
export const registerChuKhachSan = async (req, res) => {
    try {
        const { email, matKhau, hoten, cccd, ngaySinh, sdt, adminKs } = req.body;

        if (!email || !matKhau || !hoten || !cccd || !ngaySinh || !sdt || !adminKs) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const existingUser = await ChuKhachSan.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(matKhau, 10);

        const newChuKhachSan = new ChuKhachSan({
            email,
            matKhau: hashedPassword,
            hoten,
            cccd,
            ngaySinh,
            sdt,
            adminKs,
        });

        await newChuKhachSan.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login a ChuKhachSan
export const loginChuKhachSan = async (req, res) => {
    try {
        const { email, matKhau } = req.body;

        if (!email || !matKhau) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const chuKhachSan = await ChuKhachSan.findOne({ email });
        if (!chuKhachSan) {
            return res.status(404).json({ message: "Email not found." });
        }

        const isPasswordValid = await bcrypt.compare(matKhau, chuKhachSan.matKhau);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        const token = jwt.sign(
            { id: chuKhachSan._id },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful.",
            token,
            chuKhachSan: {
                id: chuKhachSan._id,
                hoten: chuKhachSan.hoten,
                email: chuKhachSan.email,
                sdt: chuKhachSan.sdt,
                adminKs: chuKhachSan.adminKs,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get authenticated user's profile
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.user;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID." });
        }

        const userProfile = await ChuKhachSan.findById(id);
        if (!userProfile) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CRUD operations
export const getAllChuKhachSan = async (req, res) => {
    try {
        const data = await ChuKhachSan.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChuKhachSanById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ObjectId format." });
        }

        const data = await ChuKhachSan.findById(id);
        if (!data) return res.status(404).json({ message: "User not found." });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addChuKhachSan = async (req, res) => {
    try {
        const data = new ChuKhachSan(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateChuKhachSan = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data provided for update." });
        }

        const data = await ChuKhachSan.findByIdAndUpdate(id, req.body, { new: true });

        if (!data) {
            return res.status(404).json({ message: "Hotel not found." });
        }

        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteChuKhachSan = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        const data = await ChuKhachSan.findByIdAndDelete(id);
        if (!data) return res.status(404).json({ message: "User not found." });

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
