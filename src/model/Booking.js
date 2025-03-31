import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    flightId: {
      type: mongoose.Schema.Types.ObjectId, // 🔥 Liên kết với bảng flights
      ref: "Flight",
      required: true,
    },
    passengers: [
      {
        name: String,
        email: String,
        cccd: String,
        ngaySinh: Date,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now, // Lưu ngày đặt vé
    },
  });

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;