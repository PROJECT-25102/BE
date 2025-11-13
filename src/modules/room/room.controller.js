import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  createRoomService,
  getAllRoomService,
  getDetailRoomService,
  getSeatByRoomService,
  updateRoomService,
  updateRoomStatusService,
} from "./room.service.js";

export const getSeatByRoom = handleAsync(async (req, res) => {
  const { roomId } = req.params;
  const data = await getSeatByRoomService(roomId);
  return createResponse(res, 200, "OK", data);
});

export const getAllRoom = handleAsync(async (req, res) => {
  const { query } = req;
  const data = await getAllRoomService(query);
  return createResponse(res, 200, "OK", data.data, data.meta);
});

export const getDetailRoom = handleAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getDetailRoomService(id);
  return createResponse(res, 200, "OK", data);
});

export const createRoom = handleAsync(async (req, res) => {
  const { body } = req;
  const data = await createRoomService(body);
  return createResponse(res, 201, "Tạo phòng chiếu mới thành công!", data);
});

export const updateRoom = handleAsync(async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const data = await updateRoomService(id, body);
  return createResponse(res, 200, "Cập nhật phòng chiếu thành công!", data);
});

export const updateStatusRoom = handleAsync(async (req, res) => {
  const { id } = req.params;
  const data = await updateRoomStatusService(id);
  return createResponse(res, 200, data.message, data.data);
});
