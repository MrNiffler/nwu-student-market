import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingsByUser,
  updateBookingStatus,
  deleteBooking
} from "../controllers/bookings.controller.js";

const router = express.Router();

router.get("/", getAllBookings);
router.get("/user/:userId", getBookingsByUser);
router.post("/", createBooking);
router.patch("/:id/status", updateBookingStatus);
router.delete("/:id", deleteBooking);

export default router;
