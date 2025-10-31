import { CLIENT_URL } from "../../common/configs/environment.js";
import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { AUTH_MESSAGES } from "./auth.messages.js";
import {
  callbackLoginGoogleService,
  loginGooleService,
  loginService,
  registerService,
  resetPasswordService,
  sendVerifyService,
  verifyUserService,
} from "./auth.service.js";
import querystring from "querystring";

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

export const resetPassword = handleAsync(async (req, res) => {
  const { email } = req.body;
  const response = await resetPasswordService(email);
  return createResponse(res, 200, AUTH_MESSAGES.RESETPASS_SUCCESS, response);
});

export const loginGoogle = handleAsync(async (req, res) => {
  const response = await loginGooleService();
  return createResponse(res, 200, ROOT_MESSAGES.OK, response);
});

export const callbackGoogle = handleAsync(async (req, res) => {
  const { error, code } = req.query;
  if (error || !code) {
    return res.redirect(`${CLIENT_URL}/auth/login?error=${error}`);
  }
  const response = await callbackLoginGoogleService(code);
  if (!response.success) {
    return res.redirect(`${CLIENT_URL}/auth/login?error=${response.data}`);
  }

  return res.redirect(
    `${CLIENT_URL}/login-google/${response.accessToken}?${querystring.stringify(
      {
        ...response.user,
      },
    )}`,
  );
});
