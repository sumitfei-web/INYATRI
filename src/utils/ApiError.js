class ApiError extends Error {
  constructor(statusCode = 500, message = 'Something went wrong', errors = [], data = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;