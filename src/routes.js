import { Router } from "express";
import authRoute from "./modules/auth/auth.routes.js";
import { authenticate } from "./common/middlewares/auth.middleware.js";
import { JWT_ACCESS_SECRET } from "./common/configs/environment.js";
import userRoute from "./modules/user/user.routes.js";
import movieRoute from "./modules/movie/movie.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import roomRoute from "./modules/room/room.routes.js";
import seatRoute from "./modules/seat/seat.routes.js";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/user", authenticate(JWT_ACCESS_SECRET), userRoute);
routes.use("/movie", movieRoute);
routes.use("/category", categoryRouter);
routes.use("/room", roomRoute);
routes.use("/seat", seatRoute);

export default routes;
