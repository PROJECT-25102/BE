import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  changePasswordService,
  createUserService,
  getAllUserService,
  getDetailUserService,
  getMyDetailTicketService,
  getMyticketService,
  getProfileService,
  updateBlockUserService,
  updateProfileService,
  updateUserService,
} from "./user.service.js";

export const getProfile = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const response = await getProfileService(_id);
  return createResponse(res, 200, "OK", response);
});

export const updateProfile = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const response = await updateProfileService(req.body, _id);
  return createResponse(res, 200, "Cập nhật thông tin thành công!", response);
});

export const changePassword = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const response = await changePasswordService(req.body, _id);
  return createResponse(res, 200, "Đổi mật khẩu thành công!", response);
});

export const getMyTicket = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const response = await getMyticketService(_id, req.query);
  return createResponse(res, 200, "OK", response.data, response.meta);
});

export const getDetailMyTicket = handleAsync(async (req, res) => {
  const { ticketId } = req.params;
  const { _id } = req.user;
  const response = await getMyDetailTicketService(_id, ticketId);
  console.log(response);
  return createResponse(res, 200, "OK", response);
});

export const getAllUser = handleAsync(async (req, res) => {
  const { query } = req;
  const response = await getAllUserService(query);
  return createResponse(res, 200, "OK", response.data, response.meta);
});

export const getDetailUser = handleAsync(async (req, res) => {
  const { id } = req;
  const response = await getDetailUserService(id);
  return createResponse(res, 200, "OK", response);
});

export const updateBlockUser = handleAsync(async (req, res) => {
  const { body, params } = req;
  const updated = await updateBlockUserService(params.id, body);
  return createResponse(
    res,
    200,
    updated.banned.isBanned
      ? "Khoá người dùng thành công"
      : "Mở khoá người dùng thành công",
    updated,
  );
});

export const updateUser = handleAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const updated = await updateUserService(id, payload);
  return createResponse(res, 200, "Cập nhật thành công", updated);
});

export const createUser = handleAsync(async (req, res) => {
  const { body } = req;
  const user = await createUserService(body);
  return createResponse(res, 200, "Tạo người dùng thành công", user);
});
