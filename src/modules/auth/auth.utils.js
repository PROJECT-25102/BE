import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
