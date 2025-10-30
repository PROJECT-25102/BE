import { throwIfDuplicate } from "../../common/utils/create-response.js";
import User from "../user/user.model.js";
import { AUTH_MESSAGES } from "./auth.messages.js";
import { hashPassword } from "./auth.utils.js";

export const registerService = async (payload) => {
  const { email, phone, password } = payload;
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    const { email: existingEmail, phone: existingPhone } = existingUser;
    throwIfDuplicate(email, existingEmail, AUTH_MESSAGES.CONFLICT_EMAIL);
    throwIfDuplicate(phone, existingPhone, AUTH_MESSAGES.CONFLICT_PHONE);
  }
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });
  await user.save();
  return user;
};
