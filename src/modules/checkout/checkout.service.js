import {
  extendHoldSeatTime,
  unHoldSeatService,
} from "../seat-status/seat.status.service.js";
import {
  checkAvaiableMovie,
  checkAvaiableRoom,
} from "../showtime/showtime.utils.js";
import Ticket from "../ticket/ticket.model.js";
import {
  checkingHoldSeat,
  checkShowtimeAvaiable,
  generateVnpayLink,
  updateSeatsToBooked,
  updateShowtimeStatus,
} from "./checkout.utils.js";

export const checkoutWithVnpayService = async (payload, userId) => {
  const seat = payload.items.map((item) => ({
    label: item.seatLabel,
    _id: item.seatId,
  }));
  await checkShowtimeAvaiable(payload.showtimeId);
  await checkingHoldSeat(userId, payload.showtimeId, seat);
  await checkAvaiableMovie(payload.movieId);
  await checkAvaiableRoom(payload.roomId);
  await extendHoldSeatTime(
    userId,
    payload.showtimeId,
    seat.map((item) => item._id),
  );
  const ticket = await Ticket.create({ ...payload, userId });
  ticket.qrCode = ticket.ticketId;
  await ticket.save();
  const data = await generateVnpayLink(ticket._id, payload.totalPrice, userId);
  return data;
};

export const checkoutReturnVnpay = async (query) => {
  const responseCode = query.vnp_ResponseCode;
  const ticketId = query.vnp_TxnRef;
  const ticket = await Ticket.findById(ticketId);
  const seat = ticket.items.map((item) => ({
    label: item.seatLabel,
    _id: item.seatId,
  }));
  if (responseCode !== "00") {
    await unHoldSeatService(ticket.userId, ticket.showtimeId, seat);
    await ticket.deleteOne();
    return {
      message: "Thanh toán thất bại",
      data: {
        success: false,
        ticket,
      },
    };
  }
  await updateSeatsToBooked(ticket.userId, ticket.showtimeId, seat);
  await updateShowtimeStatus(ticket.showtimeId);
  ticket.isPaid = true;
  await ticket.save();
  return {
    message: "Thanh toán thành công",
    data: {
      success: true,
      ticket,
    },
  };
};
