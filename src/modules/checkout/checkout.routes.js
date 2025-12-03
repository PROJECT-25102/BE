import { Router } from "express";
import { JWT_ACCESS_SECRET } from "../../common/configs/environment.js";
import { authenticate } from "../../common/middlewares/auth.middleware.js";
import { checkoutWithVNpay, returnWithVNpay } from "./checkout.controller.js";

const checkoutRoute = Router();

checkoutRoute.post(
  "/create-vnpay",
  authenticate(JWT_ACCESS_SECRET),
  checkoutWithVNpay,
);
checkoutRoute.use("/return-vnpay", returnWithVNpay);

export default checkoutRoute;
