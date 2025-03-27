import  LoaiPhong  from "../model/LoaiPhong.js";
import mongoose from "mongoose";
import multer from "multer";
import jwt from "jsonwebtoken";

// Cấu hình multer để lưu ảnh phòng
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middleware xác thực JWT
export const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Lấy tất cả loại phòng
export const getAllLoaiPhong = async (req, res) => {
    try {
        const data = await LoaiPhong.find().populate("idks");
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy loại phòng theo ID
export const getLoaiPhongById = async (req, res) => {
    const { id } = req.params;
    try {
        const loaiPhong = await LoaiPhong.findById(id).populate("idks");
        if (!loaiPhong) return res.status(404).json({ message: "LoaiPhong not found" });
        res.status(200).json(loaiPhong);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm loại phòng mới
export const addLoaiPhong = [
    upload.single("hinhAnhphong"),
    async (req, res) => {
        try {
            const { TenLp, mayLanh, gia, soLuongGiuong, soLuongPhong, idks, ngayNhanPhong, ngayTraPhong } = req.body;
            const hinhAnhphong = req.file ? req.file.filename : "";

            const newLoaiPhong = new LoaiPhong({
                TenLp,
                mayLanh,
                hinhAnhphong,
                gia,
                soLuongGiuong,
                soLuongPhong,
                idks,
                ngayNhanPhong,
                ngayTraPhong,
            });

            await newLoaiPhong.save();
            res.status(201).json(newLoaiPhong);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
];

// Cập nhật loại phòng
export const updateLoaiPhong = [
    upload.single("hinhAnhphong"),
    async (req, res) => {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        try {
            const { TenLp, mayLanh, gia, soLuongGiuong, soLuongPhong, idks, ngayNhanPhong, ngayTraPhong } = req.body;
            const hinhAnhphong = req.file ? req.file.filename : undefined;

            const updateData = {
                TenLp,
                mayLanh,
                gia,
                soLuongGiuong,
                soLuongPhong,
                idks,
                ngayNhanPhong,
                ngayTraPhong,
            };

            if (hinhAnhphong) {
                updateData.hinhAnhphong = hinhAnhphong;
            }

            const updatedLoaiPhong = await LoaiPhong.findByIdAndUpdate(id, updateData, { new: true }).populate("idks");
            if (!updatedLoaiPhong) {
                return res.status(404).json({ message: "LoaiPhong not found." });
            }

            res.json(updatedLoaiPhong);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
];

// Xóa loại phòng
export const deleteLoaiPhong = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        const data = await LoaiPhong.findByIdAndDelete(id);
        if (!data) return res.status(404).json({ message: "LoaiPhong not found." });

        res.json({ message: "LoaiPhong deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getRoomsByHotelId = async (req, res) => {
    const { idks } = req.params;
    
    console.log("Received idks:", idks); // Debug ID nhận được từ frontend

    if (!mongoose.Types.ObjectId.isValid(idks)) {
        return res.status(400).json({ message: "Invalid hotel ID format." });
    }

    try {
        const rooms = await LoaiPhong.find({ idks: new mongoose.Types.ObjectId(idks) });
        
        console.log("Rooms found:", rooms); // Debug dữ liệu trả về từ MongoDB
        
        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ message: "No rooms found for this hotel." });
        }
        
        res.status(200).json(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error); // Log lỗi chi tiết
        res.status(500).json({ message: error.message });
    }
};
export const getRoomsWithHotel = async (req, res) => {
    try {
      const rooms = await LoaiPhong.find()
        .populate('idks') // join với KhachSan
        .lean();
  
      const formattedRooms = rooms.map(room => {
        return {
          id: room._id,
          TenLp: room.TenLp,
          mayLanh: room.mayLanh,
          hinhAnhphong: room.hinhAnhphong,
          gia: room.gia,
          soLuongGiuong: room.soLuongGiuong,
          soLuongPhong: room.soLuongPhong,
          availableDates: room.availableDates,
          // Gán thông tin KhachSan
          khachSan: room.idks
            ? {
                id: room.idks._id,
                tenKhachSan: room.idks.tenKhachSan,
                diaChi: room.idks.diaChi,
                soSao: room.idks.soSao,
                hinhAnh: room.idks.hinhAnh
              }
            : null
        };
      });
  
      res.status(200).json({
        success: true,
        data: formattedRooms
      });
    } catch (error) {
      console.error(' Lỗi getRoomsWithHotel:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server!'
      });
    }
  };