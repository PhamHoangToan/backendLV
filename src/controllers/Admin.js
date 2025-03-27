 // Import the Admin model
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { Admin } from "../model/Admin";  // Import the Admin model after it's defined

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

// Register a new Admin
export const registerAdmin = async (req, res) => {
    try {
        const { email, matKhau, hoten } = req.body;

        if (!email || !matKhau || !hoten ) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const hashedPassword = await bcrypt.hash(matKhau, 10);

        const newAdmin = new Admin({
            email,
            matKhau: hashedPassword,
            hoten,
        });

        await newAdmin.save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login a Admin
export const logiAdmin = async (req, res) => {
    try {
        const { email, matKhau } = req.body;

        if (!email || !matKhau) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const admin = await Admin.findOne({ email });  // Fix typo: "Admin" to "admin"
        if (!admin) {
            return res.status(404).json({ message: "Email not found." });
        }

        const isPasswordValid = await bcrypt.compare(matKhau, admin.matKhau);  // Fix typo: "Admin" to "admin"
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password." });
        }

        const token = jwt.sign(
            { id: admin._id },  // Fix typo: "Admin" to "admin"
            process.env.JWT_SECRET || "defaultsecret",
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful.",
            token,
            Admin: {
                id: admin._id,  // Fix typo: "Admin" to "admin"
                hoten: admin.hoten,  // Fix typo: "Admin" to "admin"
                email: admin.email,  // Fix typo: "Admin" to "admin"
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

        const userProfile = await Admin.findById(id);
        if (!userProfile) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CRUD operations
export const getAllAdmin = async (req, res) => {
    try {
        const data = await Admin.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ObjectId format." });
        }

        const data = await Admin.findById(id);
        if (!data) return res.status(404).json({ message: "User not found." });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addAdmin = async (req, res) => {
    try {
        const data = new Admin(req.body);
        await data.save();
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateAdmin = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No data provided for update." });
        }

        const data = await Admin.findByIdAndUpdate(id, req.body, { new: true });

        if (!data) {
            return res.status(404).json({ message: "Hotel not found." });
        }

        res.json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        const data = await Admin.findByIdAndDelete(id);
        if (!data) return res.status(404).json({ message: "User not found." });

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
