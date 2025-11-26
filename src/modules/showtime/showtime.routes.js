import { Router } from "express";
import {
  createManyShowtime,
  createShowtime,
  getAllShowtime,
  getMovieHasShowtime,
  getShowtimesByWeekday,
  updateShowtime,
} from "./showtime.controller.js";

const showtimeRoute = Router();

showtimeRoute.get("/", getAllShowtime);
showtimeRoute.get("/movie", getMovieHasShowtime);
showtimeRoute.get("/weekday", getShowtimesByWeekday);
showtimeRoute.post("/", createShowtime);
showtimeRoute.post("/many", createManyShowtime);
showtimeRoute.patch("/update/:id", updateShowtime);

export default showtimeRoute;
