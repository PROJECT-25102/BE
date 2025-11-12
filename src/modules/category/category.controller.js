import handleAsync from "../../common/utils/async-handler.js";
import createResponse, {
  throwError,
} from "../../common/utils/create-response.js";
import {
  createCategoryService,
  getAllCategoryService,
  getDetailCategoryService,
  updateCategoryService,
  updateStatusCategoryService,
} from "./category.service.js";

export const getAllCategory = handleAsync(async (req, res) => {
  const { query } = req;
  const data = await getAllCategoryService(query);
  return createResponse(res, 200, "OK", data.data, data.meta);
});

export const getDetailCategory = handleAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getDetailCategoryService(id);
  return createResponse(res, 200, "OK", data);
});

export const createCategory = handleAsync(async (req, res) => {
  const { body } = req;
  const data = await createCategoryService(body);
  return createResponse(res, 201, "Tạo thể loại thành công!", data);
});

export const updateCategory = handleAsync(async (req, res) => {
  const { params, body } = req;
  const { id } = params;
  const data = await updateCategoryService(id, body);
  return createResponse(res, 200, "Cập nhật thể loại thành công!", data);
});

export const updateStatusCategory = handleAsync(async (req, res) => {
  const { id } = req.params;
  const data = await updateStatusCategoryService(id);
  return createResponse(res, 200, data.message, data.data);
});
