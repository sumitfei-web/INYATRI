/**
 * TODO: The project currently uses custom response codes in the response body (sometimes paired with HTTP 200 status).
 * Do not change existing HTTP status code behavior at this stage as clients currently depend on it.
 * HTTP status code alignment should be considered during a future API version/refactoring.
 */
export const errorResponse = (err, res) => {
  let statusCode = err?.statusCode || err?.code || 400;
  let message =
    typeof err === "string"
      ? err
      : err && err.message
        ? err.message
        : "Something went wrong";
  const errorData = err && err.data ? err.data : [];

  if (err?.name === "SequelizeValidationError") {
    statusCode = 400;
    const details = (err.errors || []).map((e) => e.message).join(", ");
    if (details) message = details;
  } else if (err?.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    const details = (err.errors || []).map((e) => e.message).join(", ");
    if (details) message = details;
  }

  // If errorData is an object, merge its properties at root level, otherwise use it as data
  if (errorData && typeof errorData === "object" && !Array.isArray(errorData)) {
    return res.status(statusCode).json({
      code: statusCode,
      status: false,
      message,
      data: [],
      ...errorData,
    });
  }

  return res
    .status(statusCode)
    .json({ code: statusCode, status: false, message, data: errorData });
};

export const successResponse = (
  result = [],
  message = "Success",
  res,
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    code: statusCode,
    status: true,
    message,
    data: result,
  });
};

export const successEmptyResponse = (message, res) => {
  return res.status(200).json({ code: 200, status: true, message });
};

export const successEmptyResponseWithFalseStatus = (message, res) => {
  return res.status(200).json({ code: 200, status: false, message });
};

export const successResponseWithPagination = async (
  result,
  totalItems,
  message,
  res,
  page = 1,
  limit = 10,
  totalPages = null,
) => {
  return res.status(200).json({
    code: 200,
    status: true,
    message,
    data: result,
    pagination: {
      totalItems: totalItems || 0,
      currentPage: page,
      totalPages: totalPages || Math.ceil((totalItems || 0) / limit),
      limit: limit,
    },
  });
};

export const emptyResponse = (result, res) => {
  let response = {};
  if (Array.isArray(result)) {
    response = [];
  }
  return res
    .status(200)
    .json({
      code: 404,
      status: false,
      message: "No data found",
      data: response,
    });
};

export const errorEmptyResponse = (message, res) => {
  return res.status(200).json({ code: 400, status: false, message });
};

export const badRequestError = (message, res) => {
  return res.status(400).json({ code: 400, status: false, message, data: [] });
};

export const requiredFieldsResponse = (message, res) => {
  return res.status(200).json({ code: 422, status: false, message, data: {} });
};

export const alreadyExistsResponse = (message, res, data = {}) => {
  return res.status(200).json({ code: 409, status: false, message, data });
};

export const notExistsResponse = (message, res) => {
  return res.status(404).json({ code: 404, status: false, message, data: {} });
};

export const unauthorizedResponse = (message, res) => {
  return res.status(401).json({ code: 401, status: false, message, data: {} });
};

export const conflictResponse = (message, res, data = {}) => {
  return res.status(409).json({ code: 409, status: false, message, data });
};

export const tooManyRequestResponse = (message, res, data = {}) => {
  return res.status(200).json({ code: 429, status: false, message, data });
};

export const forbiddenResponse = (message, res) => {
  return res.status(403).json({ code: 403, status: false, message });
};

export const goneResponse = (message, res) => {
  return res.status(200).json({ code: 410, status: false, message, data: [] });
};

export const somethingWentWrongResponse = (message, res) => {
  return res.status(500).json({ code: 500, status: false, message });
};
