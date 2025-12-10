import { Router } from "express";
import authRoute from "./modules/auth/auth.routes.js";
import { authenticate } from "./common/middlewares/auth.middleware.js";
import { JWT_ACCESS_SECRET } from "./common/configs/environment.js";
import userRoute from "./modules/user/user.routes.js";
import movieRoute from "./modules/movie/movie.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
import roomRoute from "./modules/room/room.routes.js";
import seatRoute from "./modules/seat/seat.routes.js";
import showtimeRoute from "./modules/showtime/showtime.routes.js";
import seatStatusRoute from "./modules/seat-status/seat.status.routes.js";
import checkoutRoute from "./modules/checkout/checkout.routes.js";
import ticketRoute from "./modules/ticket/ticket.routes.js";

const routes = Router();

routes.use("/auth", authRoute);
routes.use("/user", authenticate(JWT_ACCESS_SECRET), userRoute);
routes.use("/movie", movieRoute);
routes.use("/category", categoryRouter);
routes.use("/room", roomRoute);
routes.use("/seat", seatRoute);
routes.use("/showtime", showtimeRoute);
routes.use("/seat-status", seatStatusRoute);
routes.use("/check-out", checkoutRoute);
routes.use("/ticket", ticketRoute);

export default routes;
