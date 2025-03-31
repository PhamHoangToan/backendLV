import QRCode from "qrcode";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Flight from "../model/MayBay"; // Đảm bảo đúng đường dẫn

// export const handlePaymentSuccess = async (req, res) => {
//     try {
//         const {  _id, email, orderId, totalPrice, paymentMethod } = req.body;

//         console.log("📌 flightId nhận được:",  _id); // Kiểm tra giá trị đầu vào

//         // Kiểm tra nếu flightId hợp lệ
//         if (!mongoose.Types.ObjectId.isValid( _id)) {
//             return res.status(400).json({ success: false, message: "flightId không hợp lệ" });
//         }

//         // Chuyển flightId sang ObjectId
//         const flightObjectId = new mongoose.Types.ObjectId(flightId);

//         // Tìm chuyến bay
//         const flight = await Flight.findById(flightObjectId);
//         if (!flight) {
//             return res.status(404).json({ success: false, message: "Không tìm thấy chuyến bay" });
//         }

//         console.log(`📧 Gửi email xác nhận đến ${email} cho chuyến bay ${flight.airlineName}`);

//         // 🔹 **Tạo nội dung mã QR**
//         const qrData = JSON.stringify({
//             orderId,
//             _id,
//             email,
//             totalPrice,
//             airline: flight.airlineName,
//             departure: flight.departure,
//             destination: flight.destination,
//             departureTime: flight.departureTime,
//             arrivalTime: flight.arrivalTime,
//         });

//         // 🔹 **Tạo mã QR dưới dạng Buffer**
//         const qrCodeBuffer = await QRCode.toBuffer(qrData);

//         // 🔹 **Chuẩn bị dữ liệu gửi email**
//         const flightInfo = {
//             airline: flight.airlineName,
//             flightNumber:  _id,
//             departureDate: flight.departureTime.split("T")[0],
//             departureTime: flight.departureTime,
//             origin: flight.departure,
//             destination: flight.destination,
//         };

//         const bookingDetails = {
//             totalPrice,
//         };

//         // 🔹 **Gọi hàm gửi email**
//         await sendEmailWithQRCode(email, qrCodeBuffer, flightInfo, bookingDetails);

//         return res.status(200).json({ success: true, message: "Thanh toán thành công! Email đã được gửi." });

//     } catch (error) {
//         console.error("❌ Lỗi xử lý thanh toán:", error);
//         res.status(500).json({ success: false, message: "Lỗi gửi email" });
//     }
// };


export const processPayment = async (req, res) => {
    try {
        const { flightId, email, orderId, totalPrice, paymentMethod } = req.body;

        console.log("📌 Nhận yêu cầu thanh toán:", req.body);

        if (!mongoose.Types.ObjectId.isValid(flightId)) {
            return res.status(400).json({ message: "flightId không hợp lệ!" });
        }

        // 🛠 Tải lại thông tin chuyến bay từ MongoDB
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({ message: "Không tìm thấy chuyến bay!" });
        }

        console.log("✅ Thông tin chuyến bay từ DB:", flight);

        // 🔹 **Tạo nội dung mã QR**
        const qrData = JSON.stringify({
            orderId,
            flightId: flight._id, // ✅ Đổi _id thành flight._id
            email,
            totalPrice,
            airline: flight.airlineName,
            departure: flight.departure,
            destination: flight.destination,
            departureTime: flight.departureTime,
            arrivalTime: flight.arrivalTime,
        });

        // 🔹 **Tạo mã QR dưới dạng Buffer**
        const qrCodeBuffer = await QRCode.toBuffer(qrData);
        const qrCodeBase64 = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;

        // 🔹 **Chuẩn bị dữ liệu gửi email**
        const flightInfo = {
            airline: flight.airlineName,
            flightNumber: `FLIGHT-${flight._id.toString().slice(-5)}`, // Format lại ID
            departureDate: new Intl.DateTimeFormat("vi-VN").format(new Date(flight.departureTime)), // Định dạng DD/MM/YYYY
            departureTime: new Date(flight.departureTime).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }), // Định dạng HH:mm:ss DD/MM/YYYY
            origin: flight.departure,
            destination: flight.destination ,
        };
        

        const bookingDetails = {
            totalPrice,
        };

        console.log(`📧 Gửi email xác nhận đến ${email} cho chuyến bay ${flight.airlineName}`);

        // 🔹 **Gọi hàm gửi email**
        await sendEmailWithQRCode(email, qrCodeBuffer, flightInfo, bookingDetails);
        return res.status(200).json({
            success: true,
            message: "Thanh toán thành công! Email đã được gửi.",
            qrCode: qrCodeBase64, // Gửi mã QR lên frontend
            flight,
        });
        // return res.status(200).json({
        //     success: true,
        //     message: "Thanh toán thành công! Email đã được gửi.",
        //     qrCode: `https://example.com/qrcode?orderId=${orderId}`,
        //     flight,
        // });

    } catch (error) {
        console.error("❌ Lỗi thanh toán:", error);
        return res.status(500).json({ message: "Lỗi server khi xử lý thanh toán!" });
    }
};


// ✅ **Hàm gửi email chứa mã QR**
export const sendEmailWithQRCode = async (toEmail, qrCodeBuffer, flightInfo, bookingDetails) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: toEmail,
        subject: "Xác nhận đặt vé & Mã QR của bạn",
        html: `
            <h2>Chúc mừng! Bạn đã đặt vé thành công 🎉</h2>
            <p>Thông tin chuyến bay của bạn:</p>
            <ul>
                <li><strong>Hãng bay:</strong> ${flightInfo.airline}</li>
                <li><strong>Mã chuyến bay:</strong> ${flightInfo.flightNumber}</li>
                <li><strong>Ngày bay:</strong> ${flightInfo.departureDate}</li>
                <li><strong>Giờ khởi hành:</strong> ${flightInfo.departureTime}</li>
                <li><strong>Điểm đi:</strong> ${flightInfo.origin}</li>
                <li><strong>Điểm đến:</strong> ${flightInfo.destination}</li>
                <li><strong>Tổng tiền:</strong> ${bookingDetails.totalPrice * 27000} VNĐ</li>
            </ul>
            <p>Dưới đây là mã QR của bạn:</p>
            <img src="cid:qrcode" alt="QR Code" style="max-width: 200px;"/>
            <p><strong>Nếu ảnh không hiển thị, hãy tải xuống file đính kèm.</strong></p>
        `,
        attachments: [
            {
                filename: "qrcode.png",
                content: qrCodeBuffer,
                cid: "qrcode",
            },
        ],
    };

    await transporter.sendMail(mailOptions);
};
