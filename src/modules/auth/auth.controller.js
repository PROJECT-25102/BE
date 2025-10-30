import { CLIENT_URL } from "../../common/configs/environment.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { AUTH_MESSAGES } from "./auth.messages.js";
import {
  loginService,
  registerService,
  sendVerifyService,
  verifyUserService,
} from "./auth.service.js";

export const register = handleAsync(async (req, res, next) => {
  const user = await registerService(req.body);
  return createResponse(res, 201, AUTH_MESSAGES.REGISTER_SUCCESS, user);
});

export const login = handleAsync(async (req, res, next) => {
  const response = await loginService(req.body);
  return createResponse(res, 200, AUTH_MESSAGES.LOGIN_SUCCESS, response);
});

export const verifyUser = handleAsync(async (req, res, next) => {
  const { token } = req.params;
  const response = await verifyUserService(token);
  return res.redirect(`${CLIENT_URL}/verify?status=${response.data}`);
});

export const sendVerify = handleAsync(async (req, res) => {
  const { email } = req.body;
  const response = await sendVerifyService(email);
  return createResponse(res, 200, AUTH_MESSAGES.SEND_VERIFY_SUCCESS, response);
});
