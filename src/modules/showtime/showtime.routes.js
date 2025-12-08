import { Router } from "express";
import {
  createManyShowtime,
  createShowtime,
  getAllMovieShowtimes,
  getAllShowtime,
  getDetailShowtime,
  getMovieHasShowtime,
  getShowtimesByWeekday,
  getWeekdayHasShowtime,
  updateShowtime,
} from "./showtime.controller.js";

const showtimeRoute = Router();

showtimeRoute.get("/", getAllShowtime);
showtimeRoute.get("/detail/:id", getDetailShowtime);
showtimeRoute.get("/movie", getMovieHasShowtime);
showtimeRoute.get("/movie-showtime", getAllMovieShowtimes);
showtimeRoute.get("/weekday", getShowtimesByWeekday);
showtimeRoute.get("/get-weekday", getWeekdayHasShowtime);
showtimeRoute.post("/", createShowtime);
showtimeRoute.post("/many", createManyShowtime);
showtimeRoute.patch("/update/:id", updateShowtime);

export default showtimeRoute;
