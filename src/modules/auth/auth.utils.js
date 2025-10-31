import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
} from "../../common/configs/environment.js";

export const hashPassword = async (password) => {
  const hashed = await bcrypt.hash(password, 10);
  return hashed;
};

export const comparePassword = async (password, hashPassword) => {
  const isMatch = await bcrypt.compare(password, hashPassword);
  return isMatch;
};

export const generateToken = (payload, secret, expired = "1d") => {
  const token = jwt.sign(payload, secret, { expiresIn: expired });
  return token;
};

export const generateRandomPassword = (length = 8) => {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const allChars = lower + upper + numbers;
  let password = "";
  password += upper[Math.floor(Math.random() * upper.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  password = password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("");

  return password;
};

export const getResponseGoogle = async (code) => {
  console.log(code);
  const { data: tokenResponse } = await axios.post(
    "https://oauth2.googleapis.com/token",
    null,
    {
      params: {
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: GOOGLE_REDIRECT_URL,
      },
    },
  );
  const { data: user } = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`,
      },
    },
  );

  return user;
};
