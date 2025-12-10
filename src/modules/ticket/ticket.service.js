import dayjs from "dayjs";
import { SHOWTIME_STATUS } from "../../common/constants/showtime.js";
import { TICKET_MESSAGE } from "../../common/constants/ticket-messages.js";
import { TICKET_STATUS } from "../../common/constants/ticket.js";
import { throwError } from "../../common/utils/create-response.js";
import { queryHelper } from "../../common/utils/query-helper.js";
import Showtime from "../showtime/showtime.model.js";
import Ticket from "./ticket.model.js";

export const getAllTicketService = async (query) => {
  const tickets = await queryHelper(Ticket, query);
  return tickets;
};

export const getDetailTicketService = async (id) => {
  const ticket = await Ticket.findById(id);
  return ticket;
};

export const verifyTicketService = async (id) => {
  const foundTicket = await Ticket.findOne({ ticketId: id.toUpperCase() });
  if (!foundTicket)
    return {
      status: 400,
      message: TICKET_MESSAGE.INVALID,
      data: null,
    };
  if (!foundTicket.isPaid)
    return {
      status: 400,
      message: TICKET_MESSAGE.NOTPAID,
      data: foundTicket,
    };
  if (foundTicket.status !== TICKET_STATUS.PENDING) {
    if (foundTicket.status === TICKET_STATUS.CANCELLED) {
      return {
        status: 400,
        message: TICKET_MESSAGE.CANCELLED(foundTicket.cancelDescription),
        data: foundTicket,
      };
    }
    if (foundTicket.status === TICKET_STATUS.CONFIRMED) {
      return {
        status: 400,
        message: TICKET_MESSAGE.CONFIRMED(foundTicket.usedTime),
        data: foundTicket,
      };
    }
  }
  const availableShowtime = await Showtime.findOne({
    _id: foundTicket.showtimeId,
    status: SHOWTIME_STATUS.ENDED,
  });
  if (availableShowtime) {
    return {
      status: 400,
      message: TICKET_MESSAGE.SHOWTIME_INVALID,
    };
  }
  return {
    status: 200,
    data: foundTicket,
  };
};

export const confirmTicketService = async (id) => {
  const foundTicket = await Ticket.findById(id);

  if (!foundTicket.isPaid)
    return {
      status: 400,
      message: TICKET_MESSAGE.NOTPAID,
      data: foundTicket,
    };
  if (foundTicket.status !== TICKET_STATUS.PENDING) {
    if (foundTicket.status === TICKET_STATUS.CANCELLED) {
      return {
        status: 400,
        message: TICKET_MESSAGE.CANCELLED(foundTicket.cancelDescription),
        data: foundTicket,
      };
    }
    if (foundTicket.status === TICKET_STATUS.CONFIRMED) {
      return {
        status: 400,
        message: TICKET_MESSAGE.CONFIRMED(foundTicket.usedTime),
        data: foundTicket,
      };
    }
  }
  const availableShowtime = await Showtime.findOne({
    _id: foundTicket.showtimeId,
    status: SHOWTIME_STATUS.ENDED,
  });
  if (availableShowtime) {
    return {
      status: 400,
      message: TICKET_MESSAGE.SHOWTIME_INVALID,
    };
  }
  foundTicket.status = TICKET_STATUS.CONFIRMED;
  foundTicket.usedTime = dayjs().format();
  await foundTicket.save();
  return {
    status: 200,
    data: foundTicket,
  };
};
