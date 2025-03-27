import jwt from 'jsonwebtoken';

// Middleware xác thực token
export const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Lấy token từ header Authorization

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Kiểm tra token hợp lệ
        req.user = verified; // Gắn thông tin người dùng vào req
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token" });
    }
};
