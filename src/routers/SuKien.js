import express from "express";
import {
    getAllSuKien,
    getSuKienById,
    addSuKien,
    updateSuKien,
    deleteSuKien,
    getSuKienByThanhPhoId
} from "../controllers/suKien.js";

const router = express.Router();

router.get("/sukien", getAllSuKien);
router.get("/sukien/:id", getSuKienById);
router.get("/sukien/thanhpho/:thanhPhoId", getSuKienByThanhPhoId);
router.post("/sukien", addSuKien);
router.put("/sukien/:id", updateSuKien);
router.delete("/sukien/:id", deleteSuKien);

export default router;
