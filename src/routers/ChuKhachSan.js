import express from "express";
import {
    registerChuKhachSan,
    loginChuKhachSan,
    authenticateToken,
    getUserProfile,
    getAllChuKhachSan,
    getChuKhachSanById,
    addChuKhachSan,
    updateChuKhachSan,
    deleteChuKhachSan,
} from "../controllers/ChuKhachSan";

const router = express.Router();

// Authentication routes
router.post("/chukhachsan/register", registerChuKhachSan);
router.post("/chukhachsan/login", loginChuKhachSan);
router.get("/user/profile", authenticateToken, getUserProfile);

// CRUD routes
router.get("/chukhachsan", getAllChuKhachSan);
router.get("/chukhachsan/:id", getChuKhachSanById);
router.post("/chukhachsan", addChuKhachSan);
router.put("/chukhachsan/:id", updateChuKhachSan);
router.delete("/chukhachsan/:id", deleteChuKhachSan);

export default router;
