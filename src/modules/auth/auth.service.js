import {
  JWT_ACCESS_EXPIRED,
  JWT_ACCESS_SECRET,
} from "../../common/configs/environment.js";
import {
  throwError,
  throwIfDuplicate,
} from "../../common/utils/create-response.js";
import User from "../user/user.model.js";
import { AUTH_MESSAGES } from "./auth.messages.js";
import { comparePassword, generateToken, hashPassword } from "./auth.utils.js";

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

export const loginService = async (payload) => {
  const { email, password } = payload;
  const foundUser = await User.findOne({ email });
  if (!foundUser) {
    throwError(400, AUTH_MESSAGES.NOTFOUND_EMAIL);
  }
  const checkPassword = await comparePassword(password, foundUser.password);
  if (!checkPassword) {
    throwError(400, AUTH_MESSAGES.WRONG_PASSWORD);
  }
  const payloadToken = {
    _id: foundUser._id,
    role: foundUser.role,
  };
  const accessToken = generateToken(
    payloadToken,
    JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRED,
  );

  return { user: foundUser, accessToken };
};
