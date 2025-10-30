import { Router } from "express";
import authRoute from "./modules/auth/auth.routes.js";

const routes = Router();

routes.use("/auth", authRoute);

export default routes;
