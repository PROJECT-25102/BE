import dayjs from "dayjs";

export const TICKET_MESSAGE = {
  NOTPAID: "Vé chưa được thanh toán",
  CANCELLED: (description) => `Vé này đã đã bị huỷ vì lý do: ${description}`,
  CONFIRMED: (date) =>
    `Vé này đã được sử dụng trước đó lúc: ${dayjs(date).format("HH:mm - DD/MM/YYYY")}`,
  INVALID: `Vé này không tồn tại trên hệ thống!`,
  SHOWTIME_INVALID: `Lịch chiếu này đã chiếu trong quá khứ`,
};
