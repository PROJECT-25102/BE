import { throwError } from "../../common/utils/create-response.js";
import { queryHelper } from "../../common/utils/query-helper.js";
import Movie from "../movie/movie.model.js";
import Category from "./category.model.js";

export const getAllCategoryService = async (query) => {
  const { movieCount = "true", ...queryOther } = query;
  const categories = await queryHelper(Category, queryOther);
  if (movieCount === "true") {
    const categoriesWithCount = await Promise.all(
      categories?.data.map(async (category) => {
        const movieCount = await Movie.countDocuments({
          category: category._id,
        });
        return {
          ...category.toObject(),
          movieCount,
        };
      }),
    );
    return { ...categories, data: categoriesWithCount };
  }
  return categories;
};

export const getDetailCategoryService = async (id) => {
  const category = await Category.findById(id);
  return category;
};

export const createCategoryService = async (payload) => {
  const existed = await Category.findOne({
    name: { $regex: new RegExp(payload.name, "i") },
  });
  if (existed) throwError(400, "Thể loại này đã tồn tại trong hệ thống!");
  const newCategory = await Category.create(payload);
  return newCategory;
};

export const updateCategoryService = async (id, payload) => {
  const existed = await Category.findOne({
    _id: { $ne: id },
    name: { $regex: new RegExp(payload.name, "i") },
  });
  if (existed) throwError(400, "Thể loại này đã tồn tại trong hệ thống!");
  const updated = await Category.findByIdAndUpdate(id, payload, { new: true });
  return updated;
};

export const updateStatusCategoryService = async (id) => {
  const findCategory = await Category.findOne({
    _id: id,
  });
  if (!findCategory) throwError(400, "Không tìm thấy thể loại!");
  findCategory.status = !findCategory.status;
  await findCategory.save();
  return {
    data: findCategory,
    message: findCategory.status
      ? "Kích hoạt thể loại thành công!"
      : "Khoá thể loại thành công!",
  };
};
