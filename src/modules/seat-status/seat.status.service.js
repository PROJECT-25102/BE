import dayjs from "dayjs";
import Seat from "../seat/seat.model.js";
import Showtime from "../showtime/showtime.model.js";
import { getIO } from "../socket/socket.instance.js";
import SeatStatus from "./seat.status.model.js";
import { SEAT_STATUS } from "../../common/constants/seat.status.js";
import { throwError } from "../../common/utils/create-response.js";
import Room from "../room/room.model.js";

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
  const room = await Room.findById(payload.roomId);
  const rowSeats = await SeatStatus.find({
    showtimeId: payload.showtimeId,
    row: payload.row,
    status: { $in: [SEAT_STATUS.HOLD, SEAT_STATUS.BOOKED] },
    typeSeat: { $ne: "COUPLE" },
  });
  console.log(rowSeats);
  const existingCols = rowSeats.map((s) => s.col);
  if (
    payload.col === 2 &&
    !existingCols.includes(1) &&
    !existingCols.includes(3)
  ) {
    throwError(400, "Vẫn còn ghế trống bên trái không thể mua ghế vừa chọn!");
  }
  if (
    payload.col === room.cols - 1 &&
    !existingCols.includes(room.cols) &&
    !existingCols.includes(room.cols - 2)
  ) {
    throwError(400, "Vẫn còn ghế trống bên phải không thể mua ghế vừa chọn!");
  }
  const allCols = [...existingCols, payload.col].sort((a, b) => a - b);
  for (let i = 0; i < allCols.length - 1; i++) {
    const diff = allCols[i + 1] - allCols[i];
    if (diff === 2) {
      throwError(
        400,
        "Mua ghế tạo ghế trống, Quý khách nên chọn ghế bên cạnh!",
      );
    }
  }
  const existing = await SeatStatus.findOne({
    showtimeId: payload.showtimeId,
    seatId: payload.seatId,
  });
  if (existing && existing.status === SEAT_STATUS.HOLD) {
    const remainingCols = rowSeats
      .filter((s) => s.seatId.toString() !== payload.seatId)
      .map((s) => s.col)
      .sort((a, b) => a - b);

    if (remainingCols.length > 0) {
      for (let i = 0; i < remainingCols.length - 1; i++) {
        const diff = remainingCols[i + 1] - remainingCols[i];
        if (diff === 2) {
          throwError(
            400,
            "Sẽ tạo ghế trống ở giữa hai ghế Quý khách nên hủy ghế lần lượt theo thứ tự",
          );
        }
      }
      if (remainingCols[0] === 2) {
        throwError(
          400,
          "Không thể bỏ ghế sẽ sinh ra ghế trống bên trái, vui lòng huỷ lần lượt theo thứ tự",
        );
      }
      const lastCol = room.cols;
      if (remainingCols[remainingCols.length - 1] === lastCol - 1) {
        throwError(
          400,
          "Không thể bỏ ghế sẽ sinh ra ghế trống bên phải, vui lòng huỷ lần lượt theo thứ tự",
        );
      }
    }
    await existing.deleteOne();
    const io = getIO();
    io.to(existing.showtimeId.toString()).emit("seatUpdated", {
      seatId: existing.seatId,
      scheduleId: existing.showtimeId,
      status: "available",
    });
    return { message: "Đã bỏ giữ ghế" };
  }
  const seat = await SeatStatus.create({
    userId,
    typeSeat: payload.type,
    ...payload,
  });
  const io = getIO();
  io.to(payload.showtimeId.toString()).emit("seatUpdated", {
    seatId: seat.seatId,
    scheduleId: seat.showtimeId,
    status: seat.status,
  });
  return seat;
};

export const unHoldSeatService = async (userId, showtimeId, seatIds) => {
  const conditional = {
    userId,
    status: SEAT_STATUS.HOLD,
  };
  if (showtimeId) conditional.showtimeId = showtimeId;
  if (seatIds) conditional.seatId = { $in: seatIds };
  const heldSeats = await SeatStatus.find(conditional).lean();
  if (heldSeats.length === 0) return 0;
  const showtimeIds = [...new Set(heldSeats.map((s) => String(s.showtimeId)))];
  const result = await SeatStatus.deleteMany(conditional);
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

export const extendHoldSeatTime = async (
  userId,
  showtimeId,
  seatIds,
  extraMinutes = 5,
) => {
  const filter = {
    userId,
    status: SEAT_STATUS.HOLD,
  };
  if (showtimeId) filter.showtimeId = showtimeId;
  if (seatIds) filter.seatId = { $in: seatIds };

  const newExpireTime = dayjs().add(extraMinutes, "minutes").toDate();

  const result = await SeatStatus.updateMany(filter, {
    $set: { expiredHold: newExpireTime },
  });

  return result.modifiedCount;
};
