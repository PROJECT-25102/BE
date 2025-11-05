import { Router } from "express";
import {
  createMovie,
  getAllMovie,
  getDetailMovie,
  updateMovie,
  updateStatusMovie,
} from "./movie.controller.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { JWT_ACCESS_SECRET } from "../../common/configs/environment.js";
import { validRole } from "../../common/middlewares/role.middleware.js";

const movieRoute = Router();

movieRoute.get("/", getAllMovie);
movieRoute.get("/detail/:id", getDetailMovie);
// movieRoute.use(authenticate(JWT_ACCESS_SECRET), validRole("admin"));
movieRoute.post("/", createMovie);
movieRoute.patch("/update/:id", updateMovie);
movieRoute.patch("/status/:id", updateStatusMovie);

export default movieRoute;
