import { Router } from "express";
import {
  getOverviewStatsTicket,
  getTicketHourlyToday,
  getTicketHourlyTrend,
  getTicketTypeStats,
  getTopMovie,
} from "./ticket.stats.controller.js";

const ticketStatsRoute = Router();

ticketStatsRoute.get("/", getOverviewStatsTicket);
ticketStatsRoute.get("/trend", getTicketHourlyTrend);
ticketStatsRoute.get("/trend-today", getTicketHourlyToday);
ticketStatsRoute.get("/top-movie", getTopMovie);
ticketStatsRoute.get("/type-seat", getTicketTypeStats);

export default ticketStatsRoute;
