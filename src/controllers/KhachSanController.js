import { KhachSan } from "../model/KhachSan";  // Assuming this is an ES6 export
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { DonDatPhong } from "../model/DonDatPhong"; 
// Cấu hình lưu trữ ảnh
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

// Đặt phòng khách sạn
export const bookHotel = async (req, res) => {
    const { hotelId, startDate, endDate } = req.body;
    try {
        const hotel = await KhachSan.findById(hotelId);
        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }
        
        // Xử lý đặt phòng (Logic kiểm tra phòng trống...)
        return res.status(200).json({ message: 'Booking successful', hotel });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

// Lấy tất cả khách sạn
export const getAllKhachSan = async (req, res) => {
    try {
        const data = await KhachSan.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin khách sạn theo ID
export const getKhachSanById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ObjectId format." });
        }

        const data = await KhachSan.findById(id);
        if (!data) return res.status(404).json({ message: "Hotel not found." });

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm khách sạn (kèm upload ảnh)
export const addKhachSan = async (req, res) => {
    upload.single("hinhAnh")(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        try {
            const { tenKS, diaChi, wifi, moTa, trangThai, startDate, endDate, gia, soPhong, soSao } = req.body;
            const hinhAnh = req.file ? req.file.filename : "";

            const newKhachSan = new KhachSan({
                tenKS,
                diaChi,
                wifi,
                moTa,
                trangThai,
                startDate,
                endDate,
                hinhAnh,
                gia,
                soPhong,
                soSao,
            });

            await newKhachSan.save();

            res.status(201).json({ message: "Hotel added successfully.", newKhachSan });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

// Cập nhật khách sạn theo ID (kèm upload ảnh)
export const updateKhachSan = async (req, res) => {
    upload.single("hinhAnh")(req, res, async function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        try {
            const updateData = req.body;
            if (req.file) {
                updateData.hinhAnh = req.file.filename;
            }

            const updatedHotel = await KhachSan.findByIdAndUpdate(id, updateData, { new: true });

            if (!updatedHotel) {
                return res.status(404).json({ message: "Hotel not found." });
            }

            res.json(updatedHotel);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    });
};

// Xóa khách sạn theo ID
export const deleteKhachSan = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format." });
    }

    try {
        const data = await KhachSan.findByIdAndDelete(id);
        if (!data) return res.status(404).json({ message: "Hotel not found." });

        res.json({ message: "Hotel deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getBookingsByHotelId = async (req, res) => {
    const { id } = req.params; 
  
    try {
      const bookings = await DonDatPhong.find({ hotelId: id });
  
      if (!bookings || bookings.length === 0) {
        return res.status(404).json({ message: 'No bookings found for this hotel.' });
      }
  
      // Trả về danh sách ngày đặt
      const bookedDates = bookings.map((booking) => ({
        ngayDat: booking.ngayDat,
        ngayTra: booking.ngayTra,
      }));
  
      res.status(200).json(bookedDates);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
