import { dateFormat, ignoreLogger, ProductCode, VNPay, VnpLocale } from "vnpay";
import { SEAT_STATUS } from "../../common/constants/seat.status.js";
import { throwError } from "../../common/utils/create-response.js";
import SeatStatus from "../seat-status/seat.status.model.js";
import Movie from "../movie/movie.model.js";
import Showtime from "../showtime/showtime.model.js";
import { SHOWTIME_STATUS } from "../../common/constants/showtime.js";

export const generateVnpayLink = async (orderId, amount, userId) => {
  const vnpay = new VNPay({
    tmnCode: "X3QVRQZD",
    secureSecret: "M40G9PCM890OBIRA6X2GIMEB53KZ25JW",
    vnpayHost: "https://sandbox.vnpayment.vn",
    hashAlgorithm: "SHA512",
    loggerFn: ignoreLogger,
  });
  const createDate = new Date();
  const vnp_CreateDate = dateFormat(createDate);
  const expireDate = new Date(createDate.getTime() + 5 * 60 * 1000);
  const vnp_ExpireDate = dateFormat(expireDate);
  const vnpayResponse = vnpay.buildPaymentUrl({
    vnp_Amount: amount,
    vnp_IpAddr: "127.0.0.1",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderId,
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: "http://localhost:8000/api/check-out/return-vnpay",
    vnp_Locale: VnpLocale.VN,
    vnp_CreateDate,
    vnp_ExpireDate,
  });
  return vnpayResponse;
};

export const checkShowtimeAvaiable = async (showtimeId) => {
  if (!showtimeId) throwError(400, "Showtime ID không được để trống");

  const showtime = await Showtime.findById(showtimeId).lean();
  if (!showtime) throwError(404, "Không tìm thấy showtime");
  console.log(showtime);
  if (
    [
      SHOWTIME_STATUS.ENDED,
      SHOWTIME_STATUS.SOLD_OUT,
      SHOWTIME_STATUS.CANCELLED,
    ].includes(showtime.status)
  ) {
    throwError(400, "Lịch chiếu hiện đã ngừng chiếu hoặc hết vé.");
  }
  return showtime;
};

export const updateShowtimeStatus = async (showtimeId) => {
  const showtime = await Showtime.findById(showtimeId).populate("roomId");
  if (!showtime) throwError(400, "Showtime không tồn tại");
  const seatBooked = await SeatStatus.find({
    showtimeId,
    status: SEAT_STATUS.BOOKED,
  });
  console.log(seatBooked.length);
  if (seatBooked.length === showtime.roomId.capacity)
    showtime.status = SHOWTIME_STATUS.SOLD_OUT;
  await showtime.save();
  return showtime;
};

export const checkingHoldSeat = async (userId, showtimeId, seatId) => {
  if (!seatId?.length) throwError(400, "Payload thiếu seat");
  const seats = await SeatStatus.find({
    userId,
    showtimeId,
    seatId: { $in: seatId.map((item) => item._id) },
    status: SEAT_STATUS.HOLD,
  }).populate("seatId");
  const heldSeatIds = new Set(seats.map((s) => s.seatId?._id.toString()));
  const invalidSeatIds = seatId.filter(
    (item) => !heldSeatIds.has(item._id.toString()),
  );
  if (invalidSeatIds.length > 0) {
    throwError(
      400,
      `Các ghế ${invalidSeatIds.map((item) => item.label).join(", ")} hiện không khả dụng hoặc đã hết hạn`,
    );
  }
  return seats;
};

export const updateSeatsToBooked = async (userId, showtimeId, seatId) => {
  const seats = await checkingHoldSeat(userId, showtimeId, seatId);
  const result = await SeatStatus.updateMany(
    {
      seatId: { $in: seatId.map((item) => item._id) },
      showtimeId,
      status: SEAT_STATUS.HOLD,
    },
    { $set: { status: SEAT_STATUS.BOOKED } },
  );

  return {
    modifiedCount: result.modifiedCount,
    bookedSeats: seats.map((s) => s.seatLabel),
  };
};
