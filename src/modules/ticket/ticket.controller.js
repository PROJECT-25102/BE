import mongoose from "mongoose";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  confirmTicketService,
  getAllTicketService,
  getDetailTicketService,
  verifyTicketService,
} from "./ticket.service.js";
import { TICKET_MESSAGE } from "../../common/constants/ticket-messages.js";

export const getAllTicket = handleAsync(async (req, res) => {
  const { query } = req;
  const response = await getAllTicketService(query);
  return createResponse(res, 200, "OK", response.data, response.meta);
});

export const getDetailTicket = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await getDetailTicketService(id);
  return createResponse(res, 200, "OK", response);
});

export const verifyTicket = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await verifyTicketService(id);
  return createResponse(
    res,
    response.status || 200,
    response.message ? response.message : "Xác thực vé thành công",
    response.data,
  );
});

export const confirmTicket = handleAsync(async (req, res) => {
  const { id } = req.params;
  const response = await confirmTicketService(id);
  return createResponse(
    res,
    response.status || 200,
    response.message ? response.message : "Xác thực vé thành công",
    response.data,
  );
});
