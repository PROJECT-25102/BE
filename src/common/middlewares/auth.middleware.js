import jwt from "jsonwebtoken";
import { throwError } from "../utils/create-response.js";
import { JWT_ACCESS_SECRET } from "../configs/environment.js";

export const authenticate = (secret = JWT_ACCESS_SECRET) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throwError(400, "Token không tồn tại hoặc sai định dạng");
      }
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, secret);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        error.statusCode = 401;
        error.message = "Token đã hết hạn";
      } else if (error.name === "JsonWebTokenError") {
        error.statusCode = 401;
        error.message = "Token xác thực không hợp lệ";
      } else if (!error.statusCode) {
        error.statusCode = 500;
        error.message = error.message || "Lỗi không xác định";
      }
      next(error);
    }
  };
};
