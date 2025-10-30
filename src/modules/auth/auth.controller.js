import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { AUTH_MESSAGES } from "./auth.messages.js";
import { loginService, registerService } from "./auth.service.js";

export const register = handleAsync(async (req, res, next) => {
  const user = await registerService(req.body);
  return createResponse(res, 201, AUTH_MESSAGES.REGISTER_SUCCESS, user);
});

export const login = handleAsync(async (req, res, next) => {
  const response = await loginService(req.body);
  return createResponse(res, 200, AUTH_MESSAGES.LOGIN_SUCCESS, response);
});
