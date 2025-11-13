import { Router } from "express";
import {
  createRoom,
  getAllRoom,
  getSeatByRoom,
  updateRoom,
  updateStatusRoom,
} from "./room.controller.js";

const roomRoute = Router();

roomRoute.get("/seat/:roomId", getSeatByRoom);
roomRoute.get("/", getAllRoom);
roomRoute.post("/", createRoom);
roomRoute.patch("/update/:id", updateRoom);
roomRoute.patch("/status/:id", updateStatusRoom);

export default roomRoute;
