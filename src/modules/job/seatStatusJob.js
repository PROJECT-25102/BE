import dayjs from "dayjs";
import cron from "node-cron";
import SeatStatus from "../seat-status/seat.status.model.js";
import { SEAT_STATUS } from "../../common/constants/seat.status.js";
import { getIO } from "../socket/socket.instance.js";

export const cleanExpiredSeats = async () => {
  try {
    const now = dayjs().toDate();
    console.log(now);

    const expiredSeats = await SeatStatus.find({
      status: SEAT_STATUS.HOLD,
      expiredHold: { $lt: now },
    });
    if (expiredSeats.length > 0) {
      const scheduleIds = expiredSeats.map((seat) =>
        seat.showtimeId.toString(),
      );
      const result = await SeatStatus.deleteMany({
        _id: { $in: expiredSeats.map((seat) => seat._id) },
      });
      console.log(
        `[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] Deleted ${result.deletedCount} expired hold seats.`,
      );
      const io = getIO();
      scheduleIds.forEach((scheduleId) => {
        io.to(scheduleId).emit("seatUpdated", {
          message: "Some held seats have expired",
          deletedCount: result.deletedCount,
          timestamp: dayjs().toISOString(),
        });
      });
    }
  } catch (error) {
    console.error("Error cleaning expired hold seats:", error);
  }
};

let isCronStarted = false;

export const seatStatusJob = () => {
  if (isCronStarted) return;
  isCronStarted = true;
  console.log("✓ Seat cleanup job started.");
  cleanExpiredSeats();
  cron.schedule(
    "* * * * *",
    async () => {
      console.log("✓ Seat cleanup runtime.");
      await cleanExpiredSeats();
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    },
  );
};
