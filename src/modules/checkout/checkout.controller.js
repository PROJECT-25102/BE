import { ROOT_MESSAGES } from "../../common/constants/messages.js";
import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  checkoutReturnVnpay,
  checkoutWithVnpayService,
} from "./checkout.service.js";
import qs from "query-string";

export const checkoutWithVNpay = handleAsync(async (req, res) => {
  const { body } = req;
  const response = await checkoutWithVnpayService(body, req.user._id);
  return createResponse(res, 201, ROOT_MESSAGES.OK, response);
});

export const returnWithVNpay = async (req, res) => {
  try {
    const query = req.query;
    const response = await checkoutReturnVnpay(query);
    const params = qs.stringify({
      success: response.data.success,
      ticketId: response.data.ticket._id,
      message: response.message,
    });
    return res.redirect(`http://localhost:5173/checkout-result?${params}`);
  } catch (error) {
    console.error(error);
    return res.redirect(
      `http://localhost:5173/checkout-result?success=false&message=${encodeURIComponent(
        "Lỗi server",
      )}`,
    );
  }
};
