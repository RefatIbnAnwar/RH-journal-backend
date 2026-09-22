class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFound = (what = "Resource") => new AppError(`${what} not found`, 404);
const badRequest = (msg, details) => new AppError(msg, 400, details);
const unauthorized = (msg = "Unauthorized") => new AppError(msg, 401);

module.exports = { AppError, notFound, badRequest, unauthorized };
