import express from 'express';
import { addTravel, deleteTravel, getTravel, getTravelById, updateTravel } from '../controllers/travel';

const router=express.Router();
router.get('/travel',getTravel );

router.get('/travel/:id', getTravelById);

router.post('/travel', addTravel);

router.put('/travel',updateTravel);

router.delete('/travel',deleteTravel);

export default router;