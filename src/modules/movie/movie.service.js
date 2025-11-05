import { throwError } from "../../common/utils/create-response.js";
import { queryHelper } from "../../common/utils/query-helper.js";
import Movie from "./movie.model.js";

export const getAllMovieService = async (query) => {
  const result = await queryHelper(Movie, query);
  return result;
};

export const getDetailMovieService = async (id) => {
  const movie = await Movie.findById(id);
  return movie;
};

export const createMovieService = async (payload) => {
  const existingMovie = await Movie.findOne({
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });
  if (existingMovie) throwError(400, "Phim này đã tồn tại trong hệ thống!");
  if (new Date(payload.releaseDate) < new Date()) {
    throwError(400, "Ngày công chiếu phải là ngày trong tương lai!");
  }
  const movie = await Movie.create({ ...payload });
  return movie;
};

export const updateMovieService = async (id, payload) => {
  const existingMovie = await Movie.findOne({
    _id: { $ne: id },
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });
  if (existingMovie) throwError(400, "Phim này đã tồn tại trong hệ thống!");
  const updated = await Movie.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

export const updateStatusMovieService = async (id) => {
  const movie = await Movie.findById(id);
  if (!movie) throwError(400, "Không tìm thấy phim!");
  movie.status = !movie.status;
  await movie.save();
  return {
    data: movie,
    message: movie.status
      ? "Phim đã được kích hoạt trở lại. Các xuất chiếu sẽ hoạt động trở lại!"
      : "Ẩn phim thành công. Các xuất chiếu sẽ bị tạm ngưng!",
  };
};
