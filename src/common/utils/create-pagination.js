export const createPagination = (items, page = 1, limit = 10) => {
  if (Array.isArray(items)) {
    const total = items.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return {
      data: items.slice(startIndex, endIndex),
      meta: { total, page, limit, totalPages },
    };
  } else {
    const allKeys = Object.keys(items).sort();
    const total = allKeys.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const pagedKeys = allKeys.slice(startIndex, endIndex);

    const pagedMap = {};
    pagedKeys.forEach((key) => {
      pagedMap[key] = items[key];
    });

    return {
      data: pagedMap,
      meta: { total, page, limit, totalPages },
    };
  }
};
