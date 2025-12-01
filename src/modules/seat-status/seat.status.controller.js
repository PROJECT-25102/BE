import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  getSeatShowtimeService,
  toggleSeatService,
  unHoldSeatService,
} from "./seat.status.service.js";

export const getSeatShowtime = handleAsync(async (req, res) => {
  const { roomId, showtimeId } = req.params;
  const query = req.query;
  const seats = await getSeatShowtimeService(roomId, showtimeId, query);
  return createResponse(res, 200, ROOT_MESSAGES.OK, seats);
});

export const toggleSeat = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const { body } = req;
  const data = await toggleSeatService(body, _id);
  return createResponse(res, 201, ROOT_MESSAGES.OK, data);
});

export const unHoldSeat = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const data = await unHoldSeatService(_id);
  return createResponse(res, 200, "OK", data);
});
