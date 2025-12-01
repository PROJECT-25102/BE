import { Server } from "socket.io";
import { socketConfig } from "../../common/configs/socket.js";
import { unHoldSeatService } from "../seat-status/seat.status.service.js";
import authSocketMiddleware from "./middlewares/auth.socket.middleware.js";
import seatSocketHandler from "./modules/seat.socket.handler.js";
import { setIO } from "./socket.instance.js";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, socketConfig);

  setIO(io);

  io.use(authSocketMiddleware);

  io.on("connection", (socket) => {
    console.log(`Connected: ${socket.id}`);
    seatSocketHandler(socket, io);
    socket.on("closeTabCheckout", (data) => {
      console.log("Client đóng tab:", socket.id, data);
      unHoldSeatService(data.userId);
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });

  return io;
};
