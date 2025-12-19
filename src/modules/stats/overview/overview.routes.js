import { Router } from "express";
import { getOverviewByMonth, getOverviewStats } from "./overview.controller.js";

const overviewStatsRoute = Router();

overviewStatsRoute.get("/", getOverviewStats);
overviewStatsRoute.get("/month-of-year", getOverviewByMonth);

export default overviewStatsRoute;
