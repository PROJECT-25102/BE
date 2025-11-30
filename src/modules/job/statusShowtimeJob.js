import cron from "node-cron";
import dayjs from "dayjs";
import Showtime from "../showtime/showtime.model.js";
import Movie from "../movie/movie.model.js";
import { SHOWTIME_STATUS } from "../../common/constants/showtime.js";

export async function functionUpdateStatusShowtime() {
  try {
    const now = dayjs();
    const showtimes = await Showtime.find().lean();
    for (const st of showtimes) {
      const movie = await Movie.findById(st.movieId).lean();
      if (!movie) continue;
      const start = dayjs(st.startTime);
      const end = dayjs(st.startTime).add(movie.duration, "minute");
      let newStatus = st.status;
      if (now.isBefore(start)) {
        newStatus = SHOWTIME_STATUS.SCHEDULED;
      } else if (now.isAfter(start) && now.isBefore(end)) {
        newStatus = SHOWTIME_STATUS.IN_PROGRESS;
      } else if (now.isAfter(end)) {
        newStatus = SHOWTIME_STATUS.ENDED;
      }
      if (newStatus !== st.status) {
        await Showtime.updateOne(
          { _id: st._id },
          { $set: { status: newStatus } },
        );
      }
    }
    console.log("Đã cập nhật trạng thái suất chiếu");
  } catch (err) {
    console.error("Lỗi cập nhật trạng thái suất chiếu:", err);
  }
}
let isCronStarted = false;
export const showtimeStatusJob = async () => {
  if (isCronStarted) return;
  isCronStarted = true;
  console.log("START MOVIE STATUS CRON JOB");
  await functionUpdateStatusShowtime();
  cron.schedule(
    "* * * * *",
    async () => {
      await functionUpdateStatusShowtime();
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    },
  );
};
