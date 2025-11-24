import dayjs from "dayjs";
import { throwError } from "../../common/utils/create-response.js";
import Movie from "../movie/movie.model.js";
import Room from "../room/room.model.js";
import Showtime from "./showtime.model.js";

export const checkAvaiableMovie = async (movieId) => {
  const movie = await Movie.findById(movieId);
  if (!movie) throwError(400, "Phim không tồn tại!");
  if (!movie.status) throwError(400, "Phim hiện không khả dụng!");
  return movie;
};

export const checkAvaiableRoom = async (roomId) => {
  const room = await Room.findById(roomId);
  if (!room) throwError(400, "Không tìm thấy phòng chiếu!");
  if (!room.status) throwError(400, "Phòng chiếu hiện không khả dụng!");
  return room;
};

export const calculatorEndTime = (durationMinute, startTime) => {
  const start = dayjs(startTime);
  const endTime = start.add(durationMinute, "minute").toDate();
  const dayOfWeek = start.day();
  return { endTime, dayOfWeek };
};

export const checkConflictShowtime = async (
  roomId,
  startTime,
  endTime,
  exId = null,
) => {
  const condition = {
    roomId,
    startTime: { $lt: endTime },
    endTime: { $gt: startTime },
  };
  if (exId) {
    condition._id = { $ne: exId };
  }
  const conflict = await Showtime.findOne(condition).populate("roomId");
  return conflict;
};

export const generateShowtime = async (
  payload,
  startDate,
  endDate,
  dayOfWeeks,
  fixedHour,
) => {
  const start = dayjs(startDate).startOf("day");
  const end = dayjs(endDate).endOf("day");
  const result = [];
  let current = start;
  const movie = await checkAvaiableMovie(payload.movieId);
  await checkAvaiableRoom(payload.roomId);
  while (current.isBefore(end) || current.isSame(end, "day")) {
    const day = current.day();
    if (dayOfWeeks.includes(day)) {
      let showtimeStart;
      if (typeof fixedHour === "string") {
        const [hour, minute] = fixedHour.split(":").map(Number);
        showtimeStart = current
          .hour(hour)
          .minute(minute)
          .second(0)
          .millisecond(0);
      } else {
        showtimeStart = current
          .hour(fixedHour.hour)
          .minute(fixedHour.minute)
          .second(0)
          .millisecond(0);
      }
      const { endTime } = calculatorEndTime(movie.duration, showtimeStart);
      const conflict = await checkConflictShowtime(
        payload.roomId,
        showtimeStart.toDate(),
        endTime,
      );
      if (conflict)
        throwError(
          400,
          `Phòng chiếu ${conflict.roomId.name} đã có xuất chiếu vào lúc ${dayjs(conflict.startTime).format("HH:mm, [Ngày] DD [Tháng] MM [Năm] YYYY")}`,
        );
      result.push({
        ...payload,
        startTime: showtimeStart.toDate(),
        endTime: endTime,
        dayOfWeek: showtimeStart.day(),
      });
    }
    current = current.add(1, "day");
  }

  return result;
};
