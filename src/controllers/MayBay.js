import axios from "axios";
import Flight from "../model/MayBay";
import Booking from "../model/Booking" // Mô hình dữ liệu trong MongoDB
import mongoose from "mongoose";

// Function to get the access token
export const getAccessToken = async () => {
    try {
        const response = await axios.post(
            "https://test.api.amadeus.com/v1/security/oauth2/token",
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: "u7IJu1aamWaShkbeg7jV5IvlJlNZJ8wy",  // Replace with your clientId
                client_secret: "b7R0Vn6jteeJYLuC"  // Replace with your clientSecret
            }),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );
        return response.data.access_token;  // Return the token
    } catch (error) {
        console.error("Lỗi lấy token:", error);
        throw new Error("Không thể lấy token Amadeus");
    }
};

// Function to search flights

export const bookFlight = async (req, res) => {
    try {
        let { flightId, passengers, totalPrice, flightInfo } = req.body;

        console.log("📌 flightId nhận được:", flightId, "Kiểu dữ liệu:", typeof flightId);

        //  Kiểm tra nếu flightInfo không tồn tại
        // if (!flightInfo) {
        //     return res.status(400).json({ message: "Thiếu thông tin chuyến bay (flightInfo)!" });
        // }

        // Chuyển đổi flightId thành ObjectId nếu hợp lệ
        if (mongoose.Types.ObjectId.isValid(flightId)) {
            flightId = new mongoose.Types.ObjectId(flightId);
        } else {
            console.log("⚠️ flightId không hợp lệ, tạo mới chuyến bay...");
            flightId = new mongoose.Types.ObjectId(); // Tạo ObjectId mới cho chuyến bay

            // 🆕 Lưu chuyến bay mới vào MongoDB
            const newFlight = new Flight({
                _id: flightId,
                airlineName: flightInfo.airlineName || "Unknown Airline",
                departure: flightInfo.departure || "Unknown",
                destination: flightInfo.destination || "Unknown",
                departureTime: flightInfo.departureTime || new Date(),
                arrivalTime: flightInfo.arrivalTime || new Date(),
                seatClass: flightInfo.seatClass || "Economy",
                seatCount: flightInfo.seatCount || 0,
                ticketPrice: flightInfo.ticketPrice || 0,
                flightStatus: flightInfo.flightStatus || "Scheduled",
                image: flightInfo.image || "",
                ticketTypes: flightInfo.ticketTypes || [],
            });

            await newFlight.save();
            flightId = newFlight._id;  // 🔥 Lấy ID của chuyến bay mới tạo
            console.log("✅ Chuyến bay mới đã được tạo với ID:", flightId);
            console.log("✅ Chuyến bay mới đã được tạo:", newFlight);
        }

        // 🔍 Tìm chuyến bay trong database
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({ message: "Không tìm thấy chuyến bay!" });
        }

        console.log("📌 Thông tin chuyến bay:", flight);
        
        // 📝 Lưu booking vào database
        const newBooking = new Booking({
            flightId: flightId, // Lưu ObjectId chuyến bay
            passengers,
            totalPrice,
        });

        await newBooking.save();
        res.status(200).json({ 
            message: "Đặt vé thành công!", 
            bookingId: newBooking._id,
            flightId: flightId  // 🔥 Trả về flightId mới cho Flutter
        });

    } catch (error) {
        console.error("❌ Lỗi đặt vé:", error);
        res.status(500).json({ message: "Lỗi server khi đặt vé!" });
    }
};

export async function searchFlights(req, res) {
    try {
        const { origin, destination, date } = req.query;

        if (!origin || !destination || !date) {
            return res.status(400).json({ error: "Thiếu tham số yêu cầu!" });
        }

        const response = await axios.get("https://test.api.amadeus.com/v2/shopping/flight-offers", {
            headers: {
                Authorization: `Bearer ${process.env.AMADEUS_ACCESS_TOKEN}`,
                Accept: "application/json"
            },
            params: {
                originLocationCode: origin,
                destinationLocationCode: destination,
                departureDate: date,
                adults: 1
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Lỗi API Amadeus:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Lỗi hệ thống!" });
    }
}


export const getFlightById = async (req, res) => {
    try {
        let { flightId } = req.params;  // Dùng let để có thể gán lại
        console.log("📌 Nhận yêu cầu lấy thông tin chuyến bay:", flightId);

        // Kiểm tra `flightId` có hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(flightId)) {
            return res.status(400).json({ message: "❌ flightId không hợp lệ!" });
        }

        // Chuyển `flightId` sang ObjectId
        const objectId = new mongoose.Types.ObjectId(flightId);

        // Tìm chuyến bay trong MongoDB
        const flight = await Flight.findById(objectId);

        if (!flight) {
            return res.status(404).json({ message: "❌ Không tìm thấy chuyến bay!" });
        }

        console.log("✅ Tìm thấy chuyến bay:", flight);
        res.status(200).json(flight);
    } catch (error) {
        console.error("❌ Lỗi lấy thông tin chuyến bay:", error);
        res.status(500).json({ message: "Lỗi server khi lấy thông tin chuyến bay!" });
    }
};
