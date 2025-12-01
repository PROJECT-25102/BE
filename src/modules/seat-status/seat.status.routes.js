import { Router } from "express";
import {
  getSeatShowtime,
  toggleSeat,
  unHoldSeat,
} from "./seat.status.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { JWT_ACCESS_SECRET } from "../../common/configs/environment.js";

const seatStatusRoute = Router();

seatStatusRoute.get("/seat-map/:roomId/:showtimeId", getSeatShowtime);
seatStatusRoute.use(authenticate(JWT_ACCESS_SECRET));
seatStatusRoute.post("/toogle-seat", toggleSeat);
seatStatusRoute.patch("/un-hold", unHoldSeat);

export default seatStatusRoute;
