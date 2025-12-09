import { throwError } from "../../common/utils/create-response.js";
import { queryHelper } from "../../common/utils/query-helper.js";
import { AUTH_MESSAGES } from "../auth/auth.messages.js";
import { comparePassword, hashPassword } from "../auth/auth.utils.js";
import Ticket from "../ticket/ticket.model.js";
import User from "./user.model.js";

export const getProfileService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throwError(401, AUTH_MESSAGES.NOTFOUND_USER);
  }
  return user;
};

export const updateProfileService = async (payload, userId) => {
  const user = await User.findById(userId);
  if (!user) throwError(400, "Không tìm thấy người dùng");
  const allowedFields = ["userName", "phone", "avatar"];
  allowedFields.forEach((field) => {
    if (payload[field] !== undefined) {
      user[field] = payload[field];
    }
  });
  await user.save();
  return user;
};

export const changePasswordService = async (payload, userId) => {
  const user = await User.findById(userId);
  if (!user) throwError(400, "Không tìm thấy người dùng!");
  const isMatchOldPassword = await comparePassword(
    payload.oldPassword,
    user.password,
  );
  if (!isMatchOldPassword) throwError(400, "Mật khẩu không chính xác!");
  const hashNewPassword = await hashPassword(payload.newPassword);
  user.password = hashNewPassword;
  return await user.save();
};

export const getMyticketService = async (userId, query) => {
  const tickets = await queryHelper(Ticket, { userId, ...query });
  return tickets;
};

export const getMyDetailTicketService = async (userId, ticketId) => {
  const ticket = await Ticket.findOne({ userId, _id: ticketId });
  return ticket;
};

export const getAllUserService = async (query) => {
  const users = await queryHelper(User, query);
  return users;
};

export const getDetailUserService = async (id) => {
  const user = await User.findById(id);
  return user;
};

export const updateUserService = async (id, payload) => {
  const user = await User.findById(id);
  if (!user) throwError(400, "Không tìm thấy người dùng này!");
  Object.assign(user, payload);
  return await user.save();
};

export const updateBlockUserService = async (id, payload) => {
  const user = await User.findById(id);
  if (!user) throwError(400, "Không tìm thấy người dùng!");
  user.banned = payload;
  return await user.save();
};

export const createUserService = async (payload) => {
  const checkEmail = await User.findOne({ emaiL: payload.emaiL });
  if (checkEmail) throwError(400, "Người dùng đã tồn tại trong hệ thống!");
  payload.password = await hashPassword("beestar@123");
  const newUser = await User.create({ ...payload });
  return newUser;
};
