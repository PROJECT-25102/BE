import cron from "node-cron";
import dayjs from "dayjs";
import Ticket from "../ticket/ticket.model.js";
import Showtime from "../showtime/showtime.model.js";
import { TICKET_STATUS } from "../../common/constants/ticket.js";

export const autoCancelTicket = async () => {
  try {
    const now = dayjs().toDate();
    const tickets = await Ticket.find({
      status: TICKET_STATUS.PENDING,
      isPaid: true,
    }).populate("showtimeId");
    if (!tickets.length) return;
    const bulkOps = [];
    for (const ticket of tickets) {
      const showtime = ticket.showtimeId;
      if (!showtime) continue;
      const showtimeEndTime = dayjs(showtime.endTime).toDate();
      if (showtimeEndTime < now) {
        bulkOps.push({
          updateOne: {
            filter: { _id: ticket._id },
            update: {
              status: TICKET_STATUS.CANCELLED,
              cancelDescription: "Khách không đến xem",
              updatedAt: new Date(),
            },
          },
        });
      }
    }
    if (bulkOps.length > 0) {
      await Ticket.bulkWrite(bulkOps);
      console.log(`Đã huỷ ${bulkOps.length} vé do khách không đến`);
    }
  } catch (err) {
    console.error("Lỗi auto cancel ticket:", err);
  }
};

let isTicketCronStarted = false;
export const ticketAutoCancelJob = () => {
  if (isTicketCronStarted) return;
  isTicketCronStarted = true;

  console.log("START TICKET AUTO CANCEL CRON JOB");

  autoCancelTicket();

  cron.schedule(
    "*/5 * * * *",
    async () => {
      console.log("CRON: Auto cancelling expired tickets");
      await autoCancelTicket();
    },
    {
      timezone: "Asia/Ho_Chi_Minh",
    },
  );
};
