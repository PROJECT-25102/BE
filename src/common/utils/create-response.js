import createError from "./create-error.js";

/**
 * Creates a standardized JSON response for API endpoints
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code (e.g., 200, 201)
 * @param {string} message - Response message
 * @param {Object} [data] - Optional response data
 * @returns {Object} Express response with JSON payload
 */
export const createResponse = (
  res,
  statusCode,
  message,
  data = null,
  meta = null,
) => {
  const response = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    ...(data !== null && { data }),
    meta,
  };

  return res.status(statusCode).json(response);
};
export const throwError = (status, message) => {
  throw createError(status, message);
};

export const throwIfDuplicate = (field, compareField, message) => {
  if (field && field === compareField) {
    throwError(400, message);
  }
};

export default createResponse;
