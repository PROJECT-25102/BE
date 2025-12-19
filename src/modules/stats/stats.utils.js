import dayjs from "dayjs";

export const resolveCompareRanges = (createdAt, field = "createdAt") => {
  const current =
    createdAt?.$gte && createdAt?.$lte
      ? {
          from: dayjs(createdAt.$gte),
          to: dayjs(createdAt.$lte),
        }
      : {
          from: dayjs().startOf("month"),
          to: dayjs().endOf("month"),
        };
  const diffDays = current.to.diff(current.from, "day") + 1;
  const previousFrom = current.from.subtract(diffDays, "day").startOf("day");
  const previousTo = current.from.subtract(1, "day").endOf("day");
  return {
    current: {
      [field]: {
        $gte: current.from.toDate(),
        $lte: current.to.toDate(),
      },
    },
    previous: {
      [field]: {
        $gte: previousFrom.toDate(),
        $lte: previousTo.toDate(),
      },
    },
  };
};

export const applyQuickFilter = (quickFilter) => {
  const now = dayjs();

  switch (quickFilter) {
    case "today":
      return {
        createdAtFrom: now.startOf("day").toISOString(),
        createdAtTo: now.endOf("day").toISOString(),
      };
    case "dayAgo":
      return {
        createdAtFrom: now.subtract(1, "day").startOf("day").toISOString(),
        createdAtTo: now.subtract(1, "day").endOf("day").toISOString(),
      };
    case "weekAgo":
      return {
        createdAtFrom: now.subtract(7, "day").toISOString(),
        createdAtTo: now.toISOString(),
      };
    case "monthAgo":
      return {
        createdAtFrom: now.subtract(1, "month").startOf("day").toISOString(),
        createdAtTo: now.toISOString(),
      };
    case "thisYear":
      return {
        createdAtFrom: now.startOf("year").toISOString(),
        createdAtTo: now.toISOString(),
      };

    default:
      return null;
  }
};
