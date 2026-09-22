const { AppError } = require("../errors/AppError");

function notFoundHandler(req, res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.name === "JsonWebTokenError")
    err = new AppError("Invalid token", 401);
  if (err.name === "TokenExpiredError")
    err = new AppError("Token expired", 401);
  if (err.type === "entity.parse.failed")
    err = new AppError("Malformed JSON body", 400);
  if (err.name === "CastError")
    err = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    err = new AppError(`${field} already exists`, 400);
  }

  const isOperational = err instanceof AppError && err.isOperational;
  const statusCode = isOperational ? err.statusCode : 500;

  console.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    statusCode,
  });

  res.status(statusCode).json({
    status: "error",
    message: isOperational ? err.message : "Internal server error",
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
}

module.exports = { notFoundHandler, errorHandler };
