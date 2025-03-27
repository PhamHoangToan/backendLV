import express from "express";
import { addAdmin, deleteAdmin, getAdminById, getAllAdmin,  logiAdmin,  loginAdmin, registerAdmin, updateAdmin } from "../controllers/Admin";

const router = express.Router();

// Authentication routes
router.post("/admin/register", registerAdmin);
router.post("/admin/login", logiAdmin);
//router.get("/user/profile", authenticateToken, getUserProfile);

// CRUD routes
router.get("/admin", getAllAdmin);
router.get("/admin/:id", getAdminById);
router.post("/admin", addAdmin);
router.put("/admin/:id", updateAdmin);
router.delete("/admin/:id", deleteAdmin);

export default router;
