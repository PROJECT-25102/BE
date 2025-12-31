import handleAsync from "../../../common/utils/async-handler.js";
import createResponse from "../../../common/utils/create-response.js";
import { applyFilter } from "../../../common/utils/query-helper.js";
import {
  getOverviewStatsTicketService,
  getTicketHourlyTodayService,
  getTicketHourlyTrendService,
  getTicketTypeStatsService,
  getTopMoviesService,
} from "./ticlet.stats.service.js";

export const getOverviewStatsTicket = handleAsync(async (req, res) => {
  const match = {};
  Object.entries(req.query).forEach(([key, value]) =>
    applyFilter(key, value, match),
  );
  const data = await getOverviewStatsTicketService(match);
  return createResponse(res, 200, "OK", data);
});

export const getTicketHourlyTrend = handleAsync(async (req, res) => {
  const match = {};
  Object.entries(req.query).forEach(([key, value]) =>
    applyFilter(key, value, match),
  );
  const data = await getTicketHourlyTrendService(match);
  return createResponse(res, 200, "OK", data);
});

export const getTicketHourlyToday = handleAsync(async (_, res) => {
  const data = await getTicketHourlyTodayService();
  return createResponse(res, 200, "OK", data);
});

export const getTopMovie = handleAsync(async (req, res) => {
  const match = {};
  Object.entries(req.query).forEach(([key, value]) =>
    applyFilter(key, value, match),
  );
  const data = await getTopMoviesService(match);
  return createResponse(res, 200, "OK", data);
});

export const getTicketTypeStats = handleAsync(async (req, res) => {
  const match = {};
  Object.entries(req.query).forEach(([key, value]) =>
    applyFilter(key, value, match),
  );
  const data = await getTicketTypeStatsService(match);
  return createResponse(res, 200, "OK", data);
});
