import dayjs from "dayjs";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  createManyShowtimeService,
  createShowtimeService,
  getAllMovieShowtimesService,
  getAllShowtimeService,
  getDetailShowtimeService,
  getMovieHasShowtimeService,
  getShowtimesByWeekdayService,
  getWeekdayHasShowtimeService,
  updateShowtimeService,
} from "./showtime.service.js";
import { DAY_NAMES } from "../../common/constants/showtime.js";

export const getAllShowtime = handleAsync(async (req, res) => {
  const { query } = req;
  const showtimes = await getAllShowtimeService(query);
  return createResponse(res, 200, "OK", showtimes.data, showtimes.meta);
});

export const getDetailShowtime = handleAsync(async (req, res) => {
  const { id } = req.params;
  const { query } = req;
  const response = await getDetailShowtimeService(id, query);
  return createResponse(res, 200, "OK", response);
});

export const getAllMovieShowtimes = handleAsync(async (req, res) => {
  const movies = await getAllMovieShowtimesService(req.query);
  return createResponse(res, 200, "OK", movies.data, movies.meta);
});

export const getWeekdayHasShowtime = handleAsync(async (req, res) => {
  const { query } = req;
  const weekDay = await getWeekdayHasShowtimeService(query);
  return createResponse(res, 200, "OK", weekDay.data, weekDay.meta);
});

export const getShowtimesByWeekday = handleAsync(async (req, res) => {
  const { query } = req;
  const showtimes = await getShowtimesByWeekdayService(query);
  return createResponse(res, 200, "OK", showtimes.data, showtimes.meta);
});

export const getMovieHasShowtime = handleAsync(async (req, res) => {
  const { query } = req;
  const movies = await getMovieHasShowtimeService(query);
  return createResponse(res, 200, "OK", movies.data, movies.meta);
});

export const createShowtime = handleAsync(async (req, res) => {
  const { body } = req;
  const created = await createShowtimeService(body);
  return createResponse(
    res,
    201,
    `Tạo lịch chiếu ${dayjs(created.startTime).format("HH:mm [Ngày] DD [Tháng] MM [Năm] YYYY")} thành công`,
    created,
  );
});

export const createManyShowtime = handleAsync(async (req, res) => {
  const { body } = req;
  const created = await createManyShowtimeService(body);
  const dayNamesSelected = body.dayOfWeeks
    .map((day) => DAY_NAMES[day])
    .join(", ");
  const message = `Tạo thành công ${created.length} xuất chiếu. Từ ngày ${dayjs(body.startDate).format("[Ngày] DD [Tháng] MM [Năm] YYYY")} đến ${dayjs(body.endDate).format("[Ngày] DD [Tháng] MM [Năm] YYYY")} với các ngày trong tuần: ${dayNamesSelected}`;
  return createResponse(res, 201, message, created);
});

export const updateShowtime = handleAsync(async (req, res) => {
  const { body, params } = req;
  const data = await updateShowtimeService(body, params.id);
  return createResponse(res, 200, "Cập nhật xuất chiếu thành công!", data);
});
