import express from "express";
const router = express.Router();
import { processPayment } from "../controllers/paymentController";

router.post("/success", processPayment);

export default router;
