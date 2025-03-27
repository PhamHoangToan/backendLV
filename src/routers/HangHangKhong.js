import express from "express";
import {
    registerHangHangKhong,
    loginHangHangKhong,
    authenticateToken,
    getAllHangHangKhong,
    getHangHangKhongById,
    addHangHangKhong,
    updateHangHangKhong,
    deleteHangHangKhong,
} from "../controllers/HangHangKhong";

const router = express.Router();

// Authentication routes
router.post("/hanghangkhong/register", registerHangHangKhong);
router.post("/hanghangkhong/login", loginHangHangKhong);

// CRUD routes
router.get("/hanghangkhong", getAllHangHangKhong);
router.get("/hanghangkhong/:id", getHangHangKhongById);
router.post("/hanghangkhong", addHangHangKhong);
router.put("/hanghangkhong/:id", updateHangHangKhong);
router.delete("/hanghangkhong/:id", deleteHangHangKhong);

export default router;
