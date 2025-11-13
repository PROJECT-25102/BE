import { throwError } from "../../common/utils/create-response.js";
import Seat from "./seat.model.js";

export const updateStatusSeatService = async (id) => {
  const findSeat = await Seat.findById(id);
  if (!findSeat) throwError(400, "Không tìm được ghế!");
  findSeat.status = !findSeat.status;
  const updated = await findSeat.save();
  return {
    message: updated.status
      ? "Kích hoạt ghế thành công!"
      : "Khoá ghế thành công!",
    data: updated,
  };
};

export const updateSeatService = async (id, payload) => {
  const findSeat = await Seat.findById(id);
  if (!findSeat) throwError(400, "Không tìm thấy ghế để cập nhật!");
  Object.assign(findSeat, payload);
  const updated = await findSeat.save();
  return updated;
};
