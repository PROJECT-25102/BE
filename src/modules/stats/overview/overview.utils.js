import { TICKET_STATUS } from "../../../common/constants/ticket.js";
import Ticket from "../../ticket/ticket.model.js";
import User from "../../user/user.model.js";

export const aggregateOverviewTicketStats = async (match) => {
  const [res] = await Ticket.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalTickets: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$status",
                  [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED],
                ],
              },
              1,
              0,
            ],
          },
        },
        totalRevenue: {
          $sum: {
            $cond: [
              {
                $in: [
                  "$status",
                  [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED],
                ],
              },
              "$totalPrice",
              0,
            ],
          },
        },
      },
    },
  ]);

  return {
    totalTickets: res?.totalTickets || 0,
    totalRevenue: res?.totalRevenue || 0,
  };
};

export const aggregateOverviewUserStats = async (match) => {
  const [res] = await User.aggregate([
    {
      $match: {
        ...match,
        isVerified: true,
        "banned.isBanned": false,
      },
    },
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
      },
    },
  ]);

  return {
    totalUsers: res?.totalUsers || 0,
  };
};

export const calcGrowth = (cur, prev) => {
  if (prev === 0 && cur > 0) return 100;
  if (cur === 0) return 0;
  return Number((((cur - prev) / prev) * 100).toFixed(1));
};
