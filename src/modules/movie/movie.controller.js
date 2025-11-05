import handleAsync from "../../common/utils/async-handler.js";
import createResponse from "../../common/utils/create-response.js";
import {
  createMovieService,
  getAllMovieService,
  getDetailMovieService,
  updateMovieService,
  updateStatusMovieService,
} from "./movie.service.js";

export const getAllMovie = handleAsync(async (req, res) => {
  const { query } = req;
  const { data, meta } = await getAllMovieService(query);
  return createResponse(res, 200, "OK", data, meta);
});

export const getDetailMovie = handleAsync(async (req, res) => {
  const { id } = req.params;
  const data = await getDetailMovieService(id);
  return createResponse(res, 200, "OK", data);
});

export const createMovie = handleAsync(async (req, res) => {
  const { body } = req;
  const data = await createMovieService(body);
  return createResponse(res, 201, "Tạo phim mới thành công", data);
});

export const updateMovie = handleAsync(async (req, res) => {
  const { body, params } = req;
  const { id } = params;
  const data = await updateMovieService(id, body);
  return createResponse(res, 200, "Cập nhật phim thành công", data);
});

export const updateStatusMovie = handleAsync(async (req, res) => {
  const { id } = req.params;
  const { message, data } = await updateStatusMovieService(id);
  return createResponse(res, 200, message, data);
});
