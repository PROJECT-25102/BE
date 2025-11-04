import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import { getProfileService } from "./user.service.js";

export const getProfile = handleAsync(async (req, res) => {
  const { _id } = req.user;
  const response = await getProfileService(_id);
  return createResponse(res, 200, "OK", response);
});
