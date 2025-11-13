import { Router } from "express";
import { updateSeat, updateStatusSeat } from "./seat.controller.js";

const seatRoute = Router();

seatRoute.patch("/status/:id", updateStatusSeat);
seatRoute.patch("/update/:id", updateSeat);

export default seatRoute;
