import dayjs from "dayjs";
import { TICKET_STATUS } from "../../../common/constants/ticket.js";
import Ticket from "../../ticket/ticket.model.js";
import { normalizeQueryTime, resolveCompareRanges } from "../stats.utils.js";
export const getOverviewStatsTicketService = async (query) => {
  const { current } = resolveCompareRanges(query?.createdAt || null);

  const [res] = await Ticket.aggregate([
    { $match: current },
    {
      $facet: {
        summary: [
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
            },
          },
        ],
        avgPerDay: [
          {
            $group: {
              _id: {
                day: {
                  $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$createdAt",
                  },
                },
              },
              ticketsPerDay: {
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
            },
          },
          {
            $group: {
              _id: null,
              avgTicketsPerDay: { $avg: "$ticketsPerDay" },
            },
          },
        ],
        peakHour: [
          {
            $match: {
              status: {
                $in: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED],
              },
            },
          },
          {
            $project: {
              hour: {
                $dateToString: {
                  format: "%H:00",
                  date: "$startTime",
                },
              },
            },
          },
          {
            $group: {
              _id: "$hour",
              totalTickets: { $sum: 1 },
            },
          },
          { $sort: { totalTickets: -1 } },
          { $limit: 1 },
        ],
        topRoom: [
          {
            $match: {
              status: {
                $in: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED],
              },
            },
          },
          {
            $group: {
              _id: "$roomName",
              totalTickets: { $sum: 1 },
            },
          },
          { $sort: { totalTickets: -1 } },
          { $limit: 1 },
        ],
      },
    },
  ]);

  const peak = res?.peakHour?.[0];
  const room = res?.topRoom?.[0];
  const queryTime = normalizeQueryTime(current);

  return {
    totalTickets: res?.summary?.[0]?.totalTickets || 0,
    avgTicketsPerDay: Math.round(res?.avgPerDay?.[0]?.avgTicketsPerDay || 0),

    peakHour: peak
      ? {
          hour: peak._id,
          totalTickets: peak.totalTickets,
        }
      : null,

    topRoom: room ? room._id : null,

    queryTime,
  };
};

export const getTicketHourlyTrendService = async (query) => {
  const { current } = resolveCompareRanges(query?.createdAt || null);
  const data = await Ticket.aggregate([
    { $match: current },
    {
      $match: {
        status: {
          $in: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED],
        },
      },
    },
    {
      $project: {
        hour: {
          $dateToString: {
            format: "%H:00",
            date: "$startTime",
          },
        },
      },
    },
    {
      $group: {
        _id: "$hour",
        totalTickets: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        hour: "$_id",
        totalTickets: 1,
      },
    },
    { $sort: { hour: 1 } },
  ]);

  const peak =
    data.length > 0
      ? data.reduce((max, cur) =>
          cur.totalTickets > max.totalTickets ? cur : max,
        )
      : null;

  return {
    data,
    peakHour: peak,
    queryTime: normalizeQueryTime(current),
  };
};

export const getTicketHourlyTodayService = async () => {
  const from = dayjs().startOf("day").toDate();
  const to = dayjs().endOf("day").add(1, "ms").toDate();
  const rawData = await Ticket.aggregate([
    {
      $match: {
        createdAt: {
          $gte: from,
          $lt: to,
        },
        status: {
          $in: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED],
        },
      },
    },
    {
      $project: {
        hour: {
          $dateToString: {
            format: "%H:00",
            date: "$createdAt",
          },
        },
      },
    },
    {
      $group: {
        _id: "$hour",
        totalTickets: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        hour: "$_id",
        totalTickets: 1,
      },
    },
    { $sort: { hour: 1 } },
  ]);
  const hours = Array.from({ length: 24 }, (_, i) =>
    dayjs().hour(i).minute(0).format("HH:00"),
  );
  const data = hours.map((hour) => {
    const found = rawData.find((item) => item.hour === hour);
    return {
      hour,
      totalTickets: found ? found.totalTickets : 0,
    };
  });
  const peakHour =
    data.length > 0
      ? data.reduce((max, cur) =>
          cur.totalTickets > max.totalTickets ? cur : max,
        )
      : null;

  return {
    data,
    peakHour,
    queryTime: {
      from,
      to,
    },
  };
};

export const getTopMoviesService = async (query) => {
  const { current } = resolveCompareRanges(query?.createdAt);
  const MIN_PERCENT = 8;
  const MAX_SLICES = 5;
  const res = await Ticket.aggregate([
    { $match: current },
    {
      $match: {
        status: {
          $in: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED],
        },
      },
    },
    {
      $group: {
        _id: "$movieId",
        movieName: { $first: "$movieName" },
        totalTickets: { $sum: 1 },
      },
    },
    { $sort: { totalTickets: -1 } },
  ]);
  const totalTickets = res.reduce((s, i) => s + i.totalTickets, 0);
  if (!totalTickets) {
    return {
      totalTickets: 0,
      data: [],
      queryTime: normalizeQueryTime(current),
    };
  }
  const withPercent = res.map((i) => ({
    movieId: i._id,
    movieName: i.movieName,
    totalTickets: i.totalTickets,
    percent: (i.totalTickets / totalTickets) * 100,
  }));
  const main = [];
  const others = [];
  for (const item of withPercent) {
    if (item.percent >= MIN_PERCENT && main.length < MAX_SLICES) {
      main.push(item);
    } else {
      others.push(item);
    }
  }
  const othersTickets = others.reduce((s, i) => s + i.totalTickets, 0);
  const result = main.map((i) => ({
    movieId: i.movieId,
    movieName: i.movieName,
    totalTickets: i.totalTickets,
    percentage: Number(i.percent.toFixed(1)),
  }));
  if (othersTickets > 0) {
    result.push({
      movieId: "others",
      movieName: "Phim khác",
      totalTickets: othersTickets,
      percentage: Number(((othersTickets / totalTickets) * 100).toFixed(1)),
    });
  }
  return {
    totalTickets,
    data: result,
    queryTime: normalizeQueryTime(current),
  };
};

export const getTicketTypeStatsService = async (query) => {
  const { current } = resolveCompareRanges(query?.createdAt || null);
  const data = await Ticket.aggregate([
    { $match: current },
    {
      $match: {
        status: { $in: [TICKET_STATUS.PENDING, TICKET_STATUS.CONFIRMED] },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.type",
        totalTickets: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id",
        totalTickets: 1,
      },
    },
  ]);

  const totalTickets = data.reduce((s, i) => s + i.totalTickets, 0);
  const withPercent = data.map((i) => ({
    type: i.type,
    totalTickets: i.totalTickets,
    percentage: Number(((i.totalTickets / totalTickets) * 100).toFixed(1)),
  }));
  const sortWithPercent = withPercent.sort(
    (a, b) => b.percentage - a.percentage,
  );
  return {
    totalTickets,
    data: sortWithPercent,
    queryTime: normalizeQueryTime(current),
  };
};
