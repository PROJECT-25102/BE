import { Router } from "express";
import {
  changePassword,
  createUser,
  getAllUser,
  getDetailMyTicket,
  getDetailUser,
  getMyTicket,
  getProfile,
  updateBlockUser,
  updateProfile,
  updateUser,
} from "./user.controller.js";

const userRoute = Router();

userRoute.get("/private", getProfile);
userRoute.patch("/update", updateProfile);
userRoute.patch("/change-password", changePassword);
userRoute.get("/my-ticket", getMyTicket);
userRoute.get("/my-ticket/detail/:ticketId", getDetailMyTicket);
userRoute.get("/all", getAllUser);
userRoute.post("/create", createUser);
userRoute.get("/detail/:id", getDetailUser);
userRoute.patch("/update-admin/:id", updateUser);
userRoute.patch("/banned/:id", updateBlockUser);

export default userRoute;
