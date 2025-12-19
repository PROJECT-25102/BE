import dayjs from "dayjs";
import Ticket from "../../ticket/ticket.model.js";
import { resolveCompareRanges } from "../stats.utils.js";
import {
  aggregateOverviewTicketStats,
  aggregateOverviewUserStats,
  calcGrowth,
} from "./overview.utils.js";
import { TICKET_STATUS } from "../../../common/constants/ticket.js";

export const getOverviewStatsService = async (query) => {
  const { current, previous } = resolveCompareRanges(query.createdAt);
  const { createdAt, page, ...rest } = query;

  const [currentStats, previousStats] = await Promise.all([
    aggregateOverviewTicketStats({
      ...rest,
      ...current,
    }),
    aggregateOverviewTicketStats({
      ...rest,
      ...previous,
    }),
  ]);

  const [currentUser, previousUser] = await Promise.all([
    aggregateOverviewUserStats({
      ...rest,
      ...current,
    }),
    aggregateOverviewUserStats({
      ...rest,
      ...previous,
    }),
  ]);

  return {
    ticket: {
      total: currentStats.totalTickets,
      previous: previousStats.totalTickets,
      growth: calcGrowth(currentStats.totalTickets, previousStats.totalTickets),
    },
    revenue: {
      total: currentStats.totalRevenue,
      previous: previousStats.totalRevenue,
      growth: calcGrowth(currentStats.totalRevenue, previousStats.totalRevenue),
    },
    newUser: {
      total: currentUser.totalUsers,
      previous: previousUser.totalUsers,
      growth: calcGrowth(currentUser.totalUsers, previousUser.totalUsers),
    },
  };
};

export const getOverviewByMonthService = async (query) => {
  const raw = await Ticket.aggregate([
    {
      $match: {
        createdAt: query,
        status: {
          $in: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED],
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m",
            date: "$createdAt",
            timezone: "Asia/Ho_Chi_Minh",
          },
        },
        revenue: { $sum: "$totalPrice" },
        tickets: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        revenue: 1,
        tickets: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  return raw;
};
