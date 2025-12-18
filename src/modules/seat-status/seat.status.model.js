import mongoose from "mongoose";
import { SEAT_STATUS } from "../../common/constants/seat.status.js";

const seatStatuSchema = new mongoose.Schema(
  {
    seatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
    },
    showtimeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    row: { type: String, required: true },
    col: { type: Number, required: true },
    typeSeat: {
      type: String,
      enum: ["NORMAL", "VIP", "COUPLE"],
      default: "NORMAL",
    },
    status: {
      type: String,
      enum: Object.values(SEAT_STATUS),
      default: SEAT_STATUS.HOLD,
    },
    expiredHold: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const SeatStatus = mongoose.model("SeatStatus", seatStatuSchema);

export default SeatStatus;
