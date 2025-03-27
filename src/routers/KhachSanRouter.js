import express from 'express';
import { 
    getAllKhachSan, 
    getKhachSanById, 
    addKhachSan, 
    updateKhachSan, 
    deleteKhachSan, 
    bookHotel ,
    getBookingsByHotelId
} from '../controllers/KhachSanController';

const router = express.Router();

router.post('/book', bookHotel);
router.get('/khachsan', getAllKhachSan);
router.get('/khachsan/:id', getKhachSanById);
router.post('/khachsan', addKhachSan);
router.put('/khachsan/:id', updateKhachSan);
router.delete('/khachsan/:id', deleteKhachSan);
router.get('/bookings/hotel/:id', getBookingsByHotelId);
export default router;
