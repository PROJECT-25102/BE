import cron from "node-cron";
import dayjs from "dayjs";
import Movie from "../movie/movie.model.js";

export const movieStatusJob = () => {
  console.log(`START MOVIE JOB`);
  cron.schedule("0 0 * * *", async () => {
    try {
      const today = dayjs().startOf("day").toDate();
      await Movie.updateMany({}, [
        {
          $set: {
            statusRelease: {
              $switch: {
                branches: [
                  { case: { $lt: [today, "$releaseDate"] }, then: "upcoming" },
                  { case: { $gt: [today, "$endDate"] }, then: "released" },
                ],
                default: "nowShowing",
              },
            },
          },
        },
      ]);
      console.log("Cập nhật statusRelease cho tất cả phim thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật statusRelease:", err);
    }
  });
};
