import express from "express";
import {
    getAllThanhPho,
    getThanhPhoById,
    addThanhPho,
    updateThanhPho,
    deleteThanhPho,
} from "../controllers/ThanhPho"; 
import { upload } from "../middleware/upload.js";
const router = express.Router();

// CRUD routes for ThanhPho
router.get("/thanhpho", getAllThanhPho);        // Get all cities
router.get("/thanhpho/:id", getThanhPhoById);   // Get a city by ID
//router.post("/thanhpho", addThanhPho);   
// router.put("/:id", updateThanhPho);      // Add a new city
router.put("/thanhpho/:id", updateThanhPho);    // Update a city by ID
router.delete("/thanhpho/:id", deleteThanhPho); // Delete a city by ID
router.post("/thanhpho", upload.single("hinhAnh"), addThanhPho);
export default router;
