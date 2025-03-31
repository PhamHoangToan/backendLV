import express from "express";
const router = express.Router();
import { searchFlights, bookFlight,getFlightById } from "../controllers/MayBay";
router.get("/flights", (req, res) => {
    const { origin, destination, date } = req.query;

    // Danh sách chuyến bay giả lập
    const flights = [
      { flightNumber: "VN123", origin, destination, departureTime: `${date}T10:00:00Z` },
      { flightNumber: "VN456", origin, destination, departureTime: `${date}T12:00:00Z` }
    ];
  
    res.json({ message: "Received request", data: flights });
});
router.post("/book-flight", bookFlight);
router.get("/:flightId", getFlightById);
router.post("/flight", searchFlights);

export default router;
