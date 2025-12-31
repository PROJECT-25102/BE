import { Router } from "express";
import {
  getOverviewByMonth,
  getOverviewStats,
  getTopRevenueMovies,
} from "./overview.controller.js";

const overviewStatsRoute = Router();

overviewStatsRoute.get("/", getOverviewStats);
overviewStatsRoute.get("/month-of-year", getOverviewByMonth);
overviewStatsRoute.get("/trend-movies", getTopRevenueMovies);

export default overviewStatsRoute;
