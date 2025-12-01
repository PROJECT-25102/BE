import { throwError } from "../../../common/utils/create-response.js";

export default async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(throwError(401, "Unauthorized"));
    next();
  } catch (error) {
    next(throwError(500, "Invalid Socket"));
  }
};
