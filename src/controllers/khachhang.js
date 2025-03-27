import { KhachHang } from "../model/KhachHang";
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

// Register a new customer
export const registerKhachHang = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const existingUser = await KhachHang.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newKhachHang = new KhachHang({
            name,
            email,
            password: hashedPassword,
        });

        await newKhachHang.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login a customer
export const loginKhachHang = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const khachHang = await KhachHang.findOne({ email });
        if (!khachHang) {
            return res.status(404).json({ message: "Email not found." });
        }

        const isPasswordValid = await bcrypt.compare(password, khachHang.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        const token = jwt.sign(
            { id: khachHang._id },
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful.",
            token,
            khachHang: {
                id: khachHang._id,
                email: khachHang.email,
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

        const userProfile = await KhachHang.findById(id);
        if (!userProfile) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CRUD operations
export const getAllKhachHang = async (req, res) => {
    try {
        const data = await KhachHang.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getKhachHangById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ObjectId format." });
        }

        const data = await KhachHang.findById(id);
        if (!data) return res.status(404).json({ message: "User not found." });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addKhachHang = async (req, res) => {
    try {
        const data = new KhachHang(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateKhachHang = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        const data = await KhachHang.findByIdAndUpdate(id, req.body, { new: true });
        if (!data) return res.status(404).json({ message: "User not found." });

        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteKhachHang = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        const data = await KhachHang.findByIdAndDelete(id);
        if (!data) return res.status(404).json({ message: "User not found." });

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};