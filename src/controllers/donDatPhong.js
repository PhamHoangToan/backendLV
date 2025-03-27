// Controller: donDatPhongController.js
import  KhachHang from '../model/KhachHang.js'
import DonDatPhong from '../model/DonDatPhong.js';
import LoaiPhong from '../model/LoaiPhong.js'; // Đây chính là "Room", nhưng bạn gọi là LoaiPhong
import { v4 as uuidv4 } from 'uuid';
// Lấy tất cả đơn đặt phòng
export const getAllDonDatPhong = async (req, res) => {
  try {
    // Lấy danh sách đơn đặt phòng, populate các thông tin liên quan
    const donDatPhongs = await DonDatPhong.find()
      .populate({
        path: 'userId',
        select: 'name email', // Lấy tên khách hàng và email
      })
      .populate({
        path: 'hotelId',
        select: 'tenKS diaChi', // Lấy tên khách sạn và địa chỉ
      })
      .populate({
        path: 'roomId',
        select: 'TenLp soLuong', // Lấy loại phòng và số lượng
      })
      .sort({ createdAt: -1 });

    if (!donDatPhongs.length) {
      return res.status(200).json({
        message: 'Chưa có đơn đặt phòng nào.',
        data: [],
      });
    }

    // Map lại dữ liệu trả về: chỉ hiển thị các thông tin cần thiết
    const formattedDonDatPhongs = donDatPhongs.map(don => ({
      id: don._id,
      user: {
        id: don.userId?._id,
        name: don.userId?.name || 'Không rõ',
        email: don.userId?.email || 'Không rõ',
      },
      hotel: {
        id: don.hotelId?._id,
        tenKS: don.hotelId?.tenKS || 'Không rõ',
        diaChi: don.hotelId?.diaChi || 'Không rõ',
      },
      room: {
        id: don.roomId?._id,
        TenLp: don.roomId?.TenLp || 'Không rõ',
        soLuong: don.roomId?.soLuong || 0,
      },
      roomType: don.roomType,
      numberOfRooms: don.numberOfRooms,
      startDate: don.startDate,
      endDate: don.endDate,
      totalPrice: don.totalPrice,
      paymentMethod: don.paymentMethod,
      status: don.status,
      ghiChu: don.ghiChu || '',
      ngayDuyet: don.ngayDuyet || null,
      createdAt: don.createdAt,
      updatedAt: don.updatedAt,
    }));

    return res.status(200).json({
      message: 'Lấy danh sách đơn đặt phòng thành công!',
      data: formattedDonDatPhongs,
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn đặt phòng:', error);

    return res.status(500).json({
      message: 'Đã xảy ra lỗi khi lấy danh sách đơn đặt phòng.',
      error: error.message,
    });
  }
};

// export const getAllDonDatPhong = async (req, res) => {
//     try {
//       // Lấy toàn bộ đơn đặt phòng
//       const donDatPhongs = await DonDatPhong.find()
//         .populate({
//           path: 'userId',
//           select: 'name email' // lấy đúng field cần thiết
//         })
//         .populate({
//           path: 'hotelId',
//           select: 'tenKhachSan diaChi' // field khách sạn
//         })
//         .populate({
//           path: 'roomId',
//           select: 'tenLoaiPhong soLuong' // field loại phòng
//         });
  
//       // Kiểm tra dữ liệu
//       if (!donDatPhongs || donDatPhongs.length === 0) {
//         return res.status(404).json({ message: 'Không có đơn đặt phòng nào.' });
//       }
  
//       // Trả về dữ liệu
//       res.status(200).json(donDatPhongs);
//     } catch (error) {
//       console.error('Lỗi getAllDonDatPhong:', error);
//       res.status(500).json({ message: error.message });
//     }
//   };

// Thêm đơn đặt phòng (Khách hàng đặt)
// export const addDonDatPhong = async (req, res) => {
//   try {
//     const {
//       userId, hotelId, roomId,
//       roomType, numberOfRooms, startDate, endDate,
//       totalPrice, paymentMethod
//     } = req.body;

//     // Kiểm tra xem phòng có còn trống không
//     const room = await LoaiPhong.findById(roomId);
//     if (!room) {
//       return res.status(404).json({ message: "Không tìm thấy phòng" });
//     }

//     const bookingStart = new Date(startDate);
//     const bookingEnd = new Date(endDate);
//     const datesToBook = [];

//     // Tạo danh sách ngày cần đặt
//     for (let d = new Date(bookingStart); d <= bookingEnd; d.setDate(d.getDate() + 1)) {
//       datesToBook.push(new Date(d));
//     }

//     // Kiểm tra xem các ngày có bị trùng không
//     const availableDates = room.availableDates.map(date => new Date(date).toISOString());

//     const isAvailable = datesToBook.every(date =>
//       availableDates.includes(date.toISOString())
//     );

//     if (!isAvailable) {
//       return res.status(400).json({ message: "Ngày bạn chọn đã có người đặt" });
//     }

//     // Lưu đơn đặt phòng
//     const newDonDatPhong = new DonDatPhong({
//       userId,
//       hotelId,
//       roomId,
//       roomType,
//       numberOfRooms,
//       startDate,
//       endDate,
//       totalPrice,
//       paymentMethod,
//       status: "pending"
//     });

//     await newDonDatPhong.save();

//     res.status(201).json({
//       message: "Đơn đặt phòng đã gửi, chờ admin duyệt!",
//       data: newDonDatPhong
//     });

//   } catch (error) {
//     console.error("Error addDonDatPhong:", error);
//     res.status(400).json({ message: error.message });
//   }
// };
export const addDonDatPhong = async (req, res) => {
    try {
      const {
        userId, hotelId, roomId,
        roomType, numberOfRooms, startDate, endDate,
        totalPrice, paymentMethod
      } = req.body;
  
      const room = await LoaiPhong.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Không tìm thấy phòng" });
      }
  
      // ✅ Kiểm tra xem có trùng ngày hay không
      const overlappingBookings = await DonDatPhong.find({
        roomId: roomId,
        status: { $ne: 'rejected' },
        $or: [
          {
            startDate: { $lte: endDate },
            endDate: { $gte: startDate }
          }
        ]
      });
  
      if (overlappingBookings.length > 0) {
        return res.status(400).json({ message: "Ngày bạn chọn đã có người đặt" });
      }
  
      // ✅ Lưu đơn đặt phòng mới
      const newDonDatPhong = new DonDatPhong({
        IdDdp: uuidv4(),
        userId,
        hotelId,
        roomId,
        roomType,
        numberOfRooms,
        startDate,
        endDate,
        totalPrice,
        paymentMethod,
        status: "pending"
      });
  
      await newDonDatPhong.save();
  
      res.status(201).json({
        message: "Đơn đặt phòng đã gửi, chờ admin duyệt!",
        data: newDonDatPhong
      });
  
    } catch (error) {
      console.error("Error addDonDatPhong:", error);
      res.status(400).json({ message: error.message });
    }
  };
  
// Admin duyệt đơn đặt phòng ➜ Khóa ngày phòng
export const approveDonDatPhong = async (req, res) => {
  try {
    const { id } = req.params;
    const { ghiChu } = req.body;

    const donDatPhong = await DonDatPhong.findById(id);
    if (!donDatPhong) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });
    }

    // Cập nhật đơn đặt phòng sang "approved"
    donDatPhong.status = "approved";
    donDatPhong.ngayDuyet = new Date();
    donDatPhong.ghiChu = ghiChu;
    await donDatPhong.save();

    // Khóa ngày phòng đã được duyệt
    const room = await LoaiPhong.findById(donDatPhong.roomId);
    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    const bookingStart = new Date(donDatPhong.startDate);
    const bookingEnd = new Date(donDatPhong.endDate);
    const datesToLock = [];

    for (let d = new Date(bookingStart); d <= bookingEnd; d.setDate(d.getDate() + 1)) {
      datesToLock.push(new Date(d));
    }

    // Loại bỏ những ngày đã được đặt khỏi availableDates
    room.availableDates = room.availableDates.filter(date =>
      !datesToLock.find(lockedDate =>
        new Date(date).toDateString() === new Date(lockedDate).toDateString()
      )
    );

    await room.save();

    res.json({
      message: "Đơn đặt phòng đã duyệt và phòng đã được khóa ngày!",
      data: donDatPhong
    });
  } catch (error) {
    console.error("Error approveDonDatPhong:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin từ chối đơn đặt phòng
export const rejectDonDatPhong = async (req, res) => {
  try {
    const { id } = req.params;

    const donDatPhong = await DonDatPhong.findById(id);
    if (!donDatPhong) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });
    }

    donDatPhong.status = "rejected";
    donDatPhong.ngayDuyet = new Date();
    await donDatPhong.save();

    res.json({
      message: "Đơn đặt phòng đã bị từ chối!",
      data: donDatPhong
    });
  } catch (error) {
    console.error("Error rejectDonDatPhong:", error);
    res.status(400).json({ message: error.message });
  }
};

// Xóa đơn đặt phòng
export const deleteDonDatPhong = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await DonDatPhong.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });
    }

    res.json({ message: "Đã xóa đơn đặt phòng thành công!" });
  } catch (error) {
    console.error("Error deleteDonDatPhong:", error);
    res.status(500).json({ message: error.message });
  }
};
