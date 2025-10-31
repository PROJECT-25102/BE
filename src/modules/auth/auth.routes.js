import { Router } from "express";
import {
  callbackGoogle,
  login,
  loginGoogle,
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
authRoute.post("/google/login", loginGoogle);
authRoute.get("/google/callback", callbackGoogle);

export default authRoute;
