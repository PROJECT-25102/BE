import dayjs from "dayjs";
import handleAsync from "../../../common/utils/async-handler.js";
import createResponse from "../../../common/utils/create-response.js";
import { applyFilter } from "../../../common/utils/query-helper.js";
import { applyQuickFilter } from "../stats.utils.js";
import {
  getOverviewByMonthService,
  getOverviewStatsService,
} from "./overview.service.js";

export const getOverviewStats = handleAsync(async (req, res) => {
  const match = {};
  Object.entries(req.query).forEach(([key, value]) =>
    applyFilter(key, value, match),
  );
  if (match.quickFilter) {
    const { createdAtFrom, createdAtTo } = applyQuickFilter(
      req.query.quickFilter,
    );
    match.createdAt = {
      $gte: createdAtFrom,
      $lte: createdAtTo,
    };
    delete match.quickFilter;
  }
  const data = await getOverviewStatsService(match);
  return createResponse(res, 200, "OK", data);
});

export const getOverviewByMonth = handleAsync(async (req, res) => {
  const yearValue = req.query.year ? Number(req.query.year) : dayjs().year();
  const startOfYear = dayjs().year(yearValue).startOf("year");
  const endOfYear = dayjs().year(yearValue).endOf("year");
  const data = await getOverviewByMonthService({
    $gte: startOfYear.toDate(),
    $lte: endOfYear.toDate(),
  });

  const start = startOfYear;

  const result = Array.from({ length: 12 }, (_, i) => {
    const monthKey = start.add(i, "month").format("YYYY-MM");
    const found = data.find((r) => r.month === monthKey);

    return {
      month: monthKey,
      revenue: found?.revenue ?? 0,
      tickets: found?.tickets ?? 0,
    };
  });

  return createResponse(res, 200, "OK", {
    year: yearValue,
    result,
  });
});
