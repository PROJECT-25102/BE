import { Router } from "express";
import {
  confirmTicket,
  getAllTicket,
  getDetailTicket,
  verifyTicket,
} from "./ticket.controller.js";

const ticketRoute = Router();

ticketRoute.get("/", getAllTicket);
ticketRoute.get("/detail/:id", getDetailTicket);
ticketRoute.post("/verify/:id", verifyTicket);
ticketRoute.patch("/confirm/:id", confirmTicket);

export default ticketRoute;
