import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { updateSeatService, updateStatusSeatService } from "./seat.service.js";

export const updateStatusSeat = handleAsync(async (req, res) => {
  const { id } = req.params;
  const data = await updateStatusSeatService(id);
  return createResponse(res, 200, data.message, data.data);
});

export const updateSeat = handleAsync(async (req, res) => {
  const { params, body } = req.params;
  const { id } = params;
  const data = await updateSeatService(id, body);
  return createResponse(res, 200, "Cập nhật ghế thành công!", data);
});
