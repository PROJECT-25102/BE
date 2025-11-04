import { throwError } from "../../common/utils/create-response.js";
import { AUTH_MESSAGES } from "../auth/auth.messages.js";
import User from "./user.model.js";

export const getProfileService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throwError(401, AUTH_MESSAGES.NOTFOUND_USER);
  }
  return user;
};
