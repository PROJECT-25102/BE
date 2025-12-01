import dayjs from "dayjs";
import Seat from "../seat/seat.model.js";
import Showtime from "../showtime/showtime.model.js";
import { getIO } from "../socket/socket.instance.js";
import SeatStatus from "./seat.status.model.js";
import { SEAT_STATUS } from "../../common/constants/seat.status.js";
import { throwError } from "../../common/utils/create-response.js";

export const getSeatShowtimeService = async (roomId, showtimeId, query) => {
  const seats = await Seat.find({ roomId, ...query }).lean();
  const seatSchedules = await SeatStatus.find({ showtimeId }).lean();
  const scheduleData = await Showtime.findById(showtimeId);

  const result = seats.map((seat) => {
    const schedule = seatSchedules.find(
      (s) => s.seatId.toString() === seat._id.toString(),
    );

    return {
      ...seat,
      userId: schedule?.userId || null,
      price: scheduleData.price,
      bookingStatus: schedule?.status || "available",
    };
  });
  const getCols = () => Math.max(...result.map((s) => s.col || 1));
  const getRows = () => Math.max(...result.map((s) => s.row || 1));
  return {
    rows: getRows(),
    cols: getCols(),
    seats: result,
  };
};

export const toggleSeatService = async (payload, userId) => {
  const existing = await SeatStatus.findOne({ seatId: payload.seatId });
  if (existing) {
    if (existing.userId?.toString() !== userId?.toString()) {
      const isHold = existing.status === SEAT_STATUS.HOLD;
      throwError(
        400,
        `Ghế ${isHold ? "đang được giữ!" : "đã được đặt trước đó!"}`,
      );
    }
    if (existing.status === SEAT_STATUS.HOLD) {
      await existing.deleteOne();
      const io = getIO();
      io.to(existing.showtimeId.toString()).emit("seatUpdated", {
        seatId: existing.seatId,
        scheduleId: existing.showtimeId,
        status: "available",
      });
      return { message: "Đã bỏ giữ ghế" };
    }
    if (existing.status === "booked") {
      throwError(400, "Bạn đã đặt ghế này rồi!");
    }
  }
  const count = await SeatStatus.countDocuments({
    userId,
    status: SEAT_STATUS.HOLD,
  });
  if (count === 4)
    throwError(400, "Bạn chỉ được phép giữ 4 ghé. Để đảm bảo hệ thống!");
  const seat = await SeatStatus.create({ userId, ...payload });
  const io = getIO();
  io.to(payload.showtimeId.toString()).emit("seatUpdated", {
    seatId: seat.seatId,
    scheduleId: seat.showtimeId,
    status: seat.status,
  });
  return seat;
};

export const unHoldSeatService = async (userId) => {
  const heldSeats = await SeatStatus.find({
    userId,
    status: SEAT_STATUS.HOLD,
  }).lean();

  if (heldSeats.length === 0) return 0;
  const showtimeIds = [...new Set(heldSeats.map((s) => String(s.showtimeId)))];
  const result = await SeatStatus.deleteMany({
    userId,
    status: SEAT_STATUS.HOLD,
  });
  const io = getIO();
  showtimeIds.forEach((showtimeId) => {
    io.to(showtimeId).emit("seatUpdated", {
      message: "Some held seats have expired",
      deletedCount: result.deletedCount,
      timestamp: dayjs().toISOString(),
    });
  });

  return result.deletedCount;
};
