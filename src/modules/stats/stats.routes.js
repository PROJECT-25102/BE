import { Router } from "express";
import overviewStatsRoute from "./overview/overview.routes.js";
import ticketStatsRoute from "./ticket/ticket.stats.routes.js";

const statsRoute = Router();

statsRoute.use("/overview", overviewStatsRoute);
statsRoute.use("/ticket", ticketStatsRoute);

export default statsRoute;
