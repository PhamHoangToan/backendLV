import express from "express";
import {
    addLoaiPhong,
    deleteLoaiPhong,
    updateLoaiPhong,
    getAllLoaiPhong, // Import getAllLoaiPhong here
    getLoaiPhongById,
    getRoomsByHotelId ,
    getRoomsWithHotel// If you need to use this function, import it too
} from "../controllers/LoaiPhong";

const router = express.Router();
router.get("/loaiPhong", getAllLoaiPhong); 
router.get("/loaiPhong/:id", getLoaiPhongById)
router.post("/loaiPhong", addLoaiPhong);
router.put("/loaiPhong/:id", updateLoaiPhong);
router.delete("/loaiPhong/:id", deleteLoaiPhong);
router.get("/hotel/:idks", getRoomsByHotelId);
router.get('/roomswithhotel', getRoomsWithHotel);
// Call getAllLoaiPhong here

export default router;
