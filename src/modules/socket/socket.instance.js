import { throwError } from "../../common/utils/create-response.js";

let io = null;

export const setIO = (instance) => {
  io = instance;
};

export const getIO = () => {
  if (!io) throwError(500, "Socket chưa đươc khởi tạo");
  return io;
};
