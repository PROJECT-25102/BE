import mongoose from "mongoose";
import { SHOWTIME_STATUS } from "../../common/constants/showtime.js";

const showtimeSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    startTime: { type: Date, required: true },
    dayOfWeek: { type: Number, required: true },
    endTime: { type: Date, required: true },
    price: [
      {
        seatType: { type: String, required: true },
        value: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: Object.values(SHOWTIME_STATUS),
      default: SHOWTIME_STATUS.SCHEDULED,
    },
    cancelDescription: {
      type: String,
      required: function () {
        return this.status === SHOWTIME_STATUS.CANCELLED;
      },
    },
  },
  { timestamps: true, versionKey: false },
);

const Showtime = mongoose.model("Showtime", showtimeSchema);
export default Showtime;
