import dayjs from "dayjs";
import { SHOWTIME_STATUS } from "../../common/constants/showtime.js";
import { throwError } from "../../common/utils/create-response.js";
import { queryHelper } from "../../common/utils/query-helper.js";
import Showtime from "./showtime.model.js";
import {
  calculatorEndTime,
  checkAvaiableMovie,
  checkAvaiableRoom,
  checkConflictShowtime,
  generateShowtime,
  groupedWithMovie,
} from "./showtime.utils.js";
import { createPagination } from "../../common/utils/create-pagination.js";
import Movie from "../movie/movie.model.js";
import { SEAT_STATUS } from "../../common/constants/seat.status.js";
import SeatStatus from "../seat-status/seat.status.model.js";

export const getAllShowtimeService = async (
  query,
  populateOptions = [
    { path: "movieId", populate: "category" },
    { path: "roomId" },
  ],
) => {
  const showtimes = await queryHelper(Showtime, query, {
    populate: populateOptions,
  });
  return showtimes;
};

export const getWeekdayHasShowtimeService = async (query) => {
  const { page = 1, limit = 10, pagination = true, ...otherQuery } = query;
  const showtimes = await getAllShowtimeService({
    ...otherQuery,
  });
  const uniqueDates = new Set();
  for (const st of showtimes.data) {
    const dateKey = dayjs(st.startTime).format("YYYY-MM-DD");
    uniqueDates.add(dateKey);
  }
  return pagination
    ? createPagination(
        Array.from(uniqueDates).sort(),
        Number(page),
        Number(limit),
      )
    : Array.from(uniqueDates).sort();
};

export const getAllMovieShowtimesService = async (query) => {
  const { page = 1, limit = 10, pagination = true, ...otherQuery } = query;

  const showtimes = await getAllShowtimeService(otherQuery);
  const movieMap = {};

  for (const st of showtimes.data) {
    if (!st.movieId) continue;
    const movieId = st.movieId._id?.toString?.() || st.movieId.toString();
    const timeKey = dayjs(st.startTime).format("HH:mm");
    if (!movieMap[movieId]) {
      movieMap[movieId] = {
        ...(st.movieId.toObject?.() ?? st.movieId),
        showtimes: [],
      };
    }
    const list = movieMap[movieId].showtimes;
    const existIndex = list.findIndex((item) => {
      const itemTime = dayjs(item.startTime).format("HH:mm");
      return itemTime === timeKey;
    });
    if (existIndex !== -1) {
      if (!list[existIndex].externalRoom) {
        list[existIndex].externalRoom = [];
      }
      const roomExists = list[existIndex].externalRoom.some(
        (room) => room?._id?.toString?.() === st.roomId?._id?.toString?.(),
      );
      if (!roomExists) {
        list[existIndex].externalRoom.push(st.roomId);
      }
      continue;
    }
    list.push({
      ...st.toObject(),
      externalRoom: [st.roomId],
    });
  }
  const result = Object.values(movieMap);
  return pagination
    ? createPagination(result, Number(page), Number(limit))
    : result;
};

export const getShowtimesByWeekdayService = async (query) => {
  const {
    page = 1,
    limit = 10,
    pagination = true,
    groupTime = false,
    ...otherQuery
  } = query;

  const showtimes = await getAllShowtimeService(otherQuery);
  const map = {};

  for (const st of showtimes.data) {
    if (!st.movieId) continue;

    const dateKey = dayjs(st.startTime).format("YYYY-MM-DD");

    if (!map[dateKey]) map[dateKey] = [];

    const existIndex = map[dateKey].findIndex(
      (item) =>
        dayjs(item.startTime).format("HH:mm") ===
        dayjs(st.startTime).format("HH:mm"),
    );
    const bookedSeat = await SeatStatus.countDocuments({
      showtimeId: st._id,
      status: SEAT_STATUS.BOOKED,
    });

    if (existIndex !== -1 && groupTime) {
      if (!map[dateKey][existIndex].externalRoom) {
        map[dateKey][existIndex].externalRoom = [];
      }
      map[dateKey][existIndex].externalRoom.push(st.roomId);
      map[dateKey][existIndex].bookedSeat += bookedSeat;
      continue;
    }
    map[dateKey].push({
      ...st.toObject(),
      externalRoom: [st.roomId],
      bookedSeat,
    });
  }

  return pagination ? createPagination(map, Number(page), Number(limit)) : map;
};

export const getDetailShowtimeService = async (id, query) => {
  const condition = {
    _id: id,
    ...query,
  };
  const showtime = await Showtime.findOne(condition)
    .populate("movieId")
    .populate("roomId");
  return showtime;
};

export const getMovieHasShowtimeService = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    statusRelease,
    sort = "name_asc",
    ...otherQuery
  } = query;

  const { data } = await getAllShowtimeService(otherQuery);
  let movies = groupedWithMovie(data);
  if (search && typeof search === "string") {
    const regex = new RegExp(search, "i");
    movies = movies.filter((movie) => regex.test(movie.name));
  }
  if (statusRelease) {
    movies = movies.filter((movie) => movie.statusRelease === statusRelease);
  }
  switch (sort) {
    case "name_asc":
      movies.sort((a, b) =>
        a.name.localeCompare(b.name, "vi", { sensitivity: "base" }),
      );
      break;
    case "name_desc":
      movies.sort((a, b) =>
        b.name.localeCompare(a.name, "vi", { sensitivity: "base" }),
      );
      break;
  }

  return createPagination(movies, Number(page), Number(limit));
};

export const createShowtimeService = async (payload) => {
  const { movieId, roomId, startTime } = payload;
  if (dayjs(startTime).isBefore(dayjs()))
    throwError(400, "Thời gian chiếu phải là ngày tương lai!");
  if (dayjs(startTime).isBefore(dayjs().add(30, "minute")))
    throwError(400, "Thời gian chiếu phải ít nhất 30 phút từ bây giờ!");

  const [movie] = await Promise.all([
    checkAvaiableMovie(movieId),
    checkAvaiableRoom(roomId),
  ]);
  const { dayOfWeek, endTime } = calculatorEndTime(movie.duration, startTime);
  const conflict = await checkConflictShowtime(roomId, startTime, endTime);
  if (conflict) {
    throwError(
      400,
      `Phòng chiếu ${conflict.roomId.name} đã có xuất chiếu vào lúc ${dayjs(conflict.startTime).format("HH:mm, [Ngày] DD [Tháng] MM [Năm] YYYY")}`,
    );
  }
  const showtime = await Showtime.create({ ...payload, dayOfWeek, endTime });
  return showtime;
};

export const createManyShowtimeService = async (payload) => {
  const { startDate, endDate, dayOfWeeks, fixedHour, ...otherPayload } =
    payload;
  if (!dayjs(startDate).isBefore(dayjs(endDate))) {
    throwError(400, "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc");
  }
  const showtimes = await generateShowtime(
    otherPayload,
    startDate,
    endDate,
    dayOfWeeks,
    fixedHour,
  );
  const createShowtimes = Showtime.insertMany(showtimes);
  return createShowtimes;
};

export const updateShowtimeService = async (payload, id) => {
  const { roomId, startTime } = payload;
  const showtime = await Showtime.findById(id);
  if (!showtime) throwError(404, "Xuất chiếu không tồn tại!");
  const movie = await Movie.findById(showtime.movieId);
  const { endTime } = calculatorEndTime(movie.duration, startTime);
  if (showtime.status === SHOWTIME_STATUS.IN_PROGRESS)
    throwError(400, "Không thể cập nhật xuất chiếu đang được chiếu!");
  const conflict = await checkConflictShowtime(roomId, startTime, endTime, id);
  console.log(conflict);
  if (conflict)
    throwError(
      400,
      `Phòng chiếu ${conflict.roomId.name} đã có xuất chiếu vào lúc ${dayjs(conflict.startTime).format("HH:mm, [Ngày] DD [Tháng] MM [Năm] YYYY")}`,
    );
  showtime.set(payload);
  await showtime.save();

  return showtime;
};
