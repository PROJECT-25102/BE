import { Router } from "express";
import {
  changePassword,
  getDetailMyTicket,
  getMyTicket,
  getProfile,
  updateProfile,
} from "./user.controller.js";

const userRoute = Router();

userRoute.get("/private", getProfile);
userRoute.patch("/update", updateProfile);
userRoute.patch("/change-password", changePassword);
userRoute.get("/my-ticket", getMyTicket);
userRoute.get("/my-ticket/detail/:ticketId", getDetailMyTicket);

export default userRoute;
