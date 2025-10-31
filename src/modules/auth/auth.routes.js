import { Router } from "express";
import {
  login,
  register,
  resetPassword,
  sendVerify,
  verifyUser,
} from "./auth.controller.js";

const authRoute = Router();

authRoute.post("/register", register);
authRoute.post("/login", login);
authRoute.post("/send-verify", sendVerify);
authRoute.get("/verify/:token", verifyUser);
authRoute.post("/reset-password", resetPassword);

export default authRoute;
