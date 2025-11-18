import dayjs from "dayjs";
import { throwError } from "../../common/utils/create-response.js";
import { queryHelper } from "../../common/utils/query-helper.js";
import Movie from "./movie.model.js";

export const getAllMovieService = async (query) => {
  const result = await queryHelper(Movie, query, {
    populate: [
      {
        path: "category",
        select: "status name description",
      },
    ],
  });
  const newData = result.data.map((movie) => ({
    ...movie.toObject(),
    category: movie.category?.filter((item) => item.status) || [],
  }));
  return { ...result, data: newData };
};

export const getDetailMovieService = async (id) => {
  const movie = await Movie.findById(id).populate([
    { path: "category", select: "-createdAt -updatedAt" },
  ]);
  const movieFilterCategory = {
    ...movie.toObject(),
    category: movie.category?.filter((item) => item.status) || [],
  };
  return movieFilterCategory;
};

export const createMovieService = async (payload) => {
  const existingMovie = await Movie.findOne({
    name: { $regex: `^${payload.name}$`, $options: "i" },
  });
  if (new Date(payload.releaseDate) > new Date(payload.endDate))
    throwError(400, "Thời gian ngừng chiếu phải sau thời gian công chiếu!");
  if (existingMovie) throwError(400, "Phim này đã tồn tại trong hệ thống!");
  if (new Date(payload.releaseDate) < new Date()) {
    throwError(400, "Ngày công chiếu phải là ngày trong tương lai!");
  }
  const movie = await Movie.create({ ...payload });
  return movie;
};

export const updateMovieService = async (id, payload) => {
  const movie = await Movie.findById(id);
  if (!movie) throwError(404, "Không tìm thấy phim trong hệ thống!");
  if (payload.name) {
    const existingMovie = await Movie.findOne({
      _id: { $ne: id },
      name: { $regex: `^${payload.name}$`, $options: "i" },
    });
    if (existingMovie)
      throwError(400, "Tên phim này đã tồn tại trong hệ thống!");
  }
  const releaseDate = payload.releaseDate
    ? dayjs(payload.releaseDate)
    : dayjs(movie.releaseDate);
  const endDate = payload.endDate
    ? dayjs(payload.endDate)
    : dayjs(movie.endDate);
  const now = dayjs();
  if (!endDate.isAfter(releaseDate)) {
    throwError(400, "Ngày ngừng chiếu phải sau ngày công chiếu!");
  }
  if (releaseDate.isAfter(now)) {
    const minEndDate = releaseDate.add(7, "day");
    const maxEndDate = releaseDate.add(1, "year");
    if (endDate.isBefore(minEndDate)) {
      throwError(
        400,
        "Ngày ngừng chiếu phải cách ngày công chiếu ít nhất 1 tuần!",
      );
    }
    if (endDate.isAfter(maxEndDate)) {
      throwError(400, "Phim không được chiếu quá 1 năm kể từ ngày công chiếu!");
    }
  }
  if (now.isBefore(releaseDate)) {
    movie.statusRelease = "upcoming";
  } else if (now.isAfter(endDate)) {
    movie.statusRelease = "ngungChieu";
  } else {
    movie.statusRelease = "nowShowing";
  }
  Object.assign(movie, payload);
  await movie.save();

  return movie;
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
