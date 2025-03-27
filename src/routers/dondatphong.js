import express from 'express';
import {
  getAllDonDatPhong,
  addDonDatPhong,
  approveDonDatPhong,
  rejectDonDatPhong,
  deleteDonDatPhong
} from '../controllers/donDatPhong';

const router = express.Router();

// Khách đặt phòng
router.post('/don-dat-phong', addDonDatPhong);

// Admin duyệt / từ chối / xóa đơn
router.get('/don-dat-phong', getAllDonDatPhong);
router.put('/don-dat-phong/approve/:id', approveDonDatPhong);
router.put('/don-dat-phong/reject/:id', rejectDonDatPhong);
router.delete('/don-dat-phong/:id', deleteDonDatPhong);

export default router;
