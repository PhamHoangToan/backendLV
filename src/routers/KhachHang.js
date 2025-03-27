import express from "express";
import {
    registerKhachHang,
    loginKhachHang,
    authenticateToken,
    getUserProfile,
    getAllKhachHang,
    getKhachHangById,
    addKhachHang,
    updateKhachHang,
    deleteKhachHang,
} from "../controllers/khachhang";

const router = express.Router();

// Authentication routes
router.post("/khachhang/register", registerKhachHang);
router.post("/khachhang/login", loginKhachHang);
router.get("/user/profile", authenticateToken, getUserProfile);

// CRUD routes
router.get("/khachhang", getAllKhachHang);
router.get("/khachhang/:id", getKhachHangById);
router.post("/khachhang", addKhachHang);
router.put("/khachhang/:id", updateKhachHang);
router.delete("/khachhang/:id", deleteKhachHang);

export default router;
