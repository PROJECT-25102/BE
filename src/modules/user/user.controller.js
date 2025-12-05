import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  changePasswordService,
  getMyDetailTicketService,
  getMyticketService,
  getProfileService,
  updateProfileService,
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
