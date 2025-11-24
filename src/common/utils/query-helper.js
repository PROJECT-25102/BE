import mongoose from "mongoose";

export const queryHelper = async (Model, queryParams, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = "createdAt",
    order = "desc",
    search,
    searchFields = [],
    pagination = false,
    isDeleted,
    ...filters
  } = queryParams;

  const { populate = [] } = options;

  const queryConditions = {};

  if (isDeleted === "false") {
    queryConditions.deletedAt = null;
  }

  if (isDeleted === "true") {
    queryConditions.deletedAt = { $ne: null };
  }

  Object.entries(filters).forEach(([key, value]) => {
    applyFilter(key, value, queryConditions);
  });

  if (search && searchFields.length > 0) {
    const searchRegex = new RegExp(search, "i");
    queryConditions.$or = searchFields.map((field) => ({
      [field]: searchRegex,
    }));
  }
  let query = Model.find(queryConditions);

  if (populate && populate.length > 0) {
    populate.forEach((pop) => {
      query = query.populate({
        path: pop.path,
        select: pop.select || null,
        populate: pop.populate || null,
      });
    });
  }

  const sortOrder = order === "desc" ? -1 : 1;
  query = query.sort({ [sort]: sortOrder });

  if (pagination) {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;
    query = query.skip(skip).limit(limitNum);

    const total = await Model.countDocuments(queryConditions);
    const data = await query.exec();

    return {
      data,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  const data = await query.exec();
  return { data };
};

function applyFilter(key, value, queryConditions) {
  if (value == null || value === "") return;

  if (value === "__nullOrEmpty__") {
    queryConditions.$or = [{ [key]: null }, { [key]: { $exists: false } }];
    return;
  }

  const match = key.match(/(From|To|Min|Max)$/);
  if (match) {
    const field = key.replace(/From$|To$|Min$|Max$/, "");
    const opMap = { From: "$gte", To: "$lte", Min: "$gte", Max: "$lte" };
    const op = opMap[match[1]];

    queryConditions[field] = {
      ...queryConditions[field],
      [op]:
        match[1] === "From" || match[1] === "To"
          ? new Date(value)
          : Number(value),
    };
    return;
  }

  if (value === "true" || value === "false") {
    queryConditions[key] = value === "true";
    return;
  }

  if (mongoose.Types.ObjectId.isValid(value)) {
    queryConditions[key] = value;
    return;
  }

  if (typeof value === "string") {
    queryConditions[key] = { $regex: new RegExp(`^${value}$`, "i") };
    return;
  }

  queryConditions[key] = value;
}
