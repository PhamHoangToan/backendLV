import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import khachHangRouter from "./routers/KhachHang";
import ChuKhachSanRouter from "./routers/ChuKhachSan";
import HangHangKhongRouter from "./routers/HangHangKhong";
import ThanhPhoRouter from "./routers/ThanhPho";
import LoaiPhongRouter from "./routers/LoaiPhong";
import AdminRouter from "./routers/Admin";
import KhachSanRouter from "./routers/KhachSanRouter";
import  ThanhPhoRouter  from "./routers/ThanhPho";
import  SuKienRouter  from "./routers/SuKien";
import DonDatPhongRouter from "./routers/dondatphong";
import Payment from "./routers/payment"
import Flight from "./routers/Maybay"
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

if (!process.env.DB_URI) {
  console.error("Error: DB_URI not defined in .env file");
  process.exit(1);
}
connectDB(process.env.DB_URI);

app.use("/api", khachHangRouter);
app.use("/api", ChuKhachSanRouter);
app.use("/api", HangHangKhongRouter);
app.use("/api", ThanhPhoRouter);
app.use("/api", LoaiPhongRouter);
app.use("/api", AdminRouter);
app.use("/api", KhachSanRouter);
app.use("/api", ThanhPhoRouter);
app.use("/api", SuKienRouter);
app.use("/api", DonDatPhongRouter);
app.use("/api",Payment);
app.use("/api",Flight);
app.use("/uploads", express.static("uploads"));
export const viteNodeApp = app;
