import { Router } from "express";
import { getProfile } from "./user.controller.js";

const userRoute = Router();

userRoute.get("/private", getProfile);

export default userRoute;
