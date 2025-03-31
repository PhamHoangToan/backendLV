import mongoose from "mongoose";

const FlightSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // ObjectId của chuyến bay
    airlineName: { type: String, required: true, default: "Unknown Airline" }, // Tên hãng bay
    departure: { type: String, required: true, default: "Unknown" }, // Sân bay khởi hành
    destination: { type: String, required: true, default: "Unknown" }, // Sân bay đích đến
    departureTime: { type: Date, required: true, default: Date.now }, // Thời gian cất cánh
    arrivalTime: { type: Date, required: true, default: Date.now }, // Thời gian hạ cánh
    seatClass: { type: String, required: true, default: "Economy" }, // Hạng ghế
    seatCount: { type: Number, required: true, default: 0 }, // Số lượng ghế
    ticketPrice: { type: Number, required: true, default: 0 }, // Giá vé
    flightStatus: { type: String, required: true, default: "Scheduled" }, // Trạng thái chuyến bay
    image: { type: String, default: "" }, // Ảnh chuyến bay
    ticketTypes: [
        {
            name: { type: String, required: true }, // Loại vé (Economy, Business, First Class,...)
            description: { type: String, default: "" }, // Mô tả loại vé
            pricePerPerson: { type: Number, required: true, default: 0 } // Giá mỗi người
        }
    ]
}, { _id: false, timestamps: true }); // `timestamps` tự động thêm `createdAt` & `updatedAt`

export default mongoose.model("MayBay", FlightSchema);
