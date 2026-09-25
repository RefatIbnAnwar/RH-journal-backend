const { validationResult } = require("express-validator");
const { AppError } = require("../errors/AppError");

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg);
    throw new AppError(messages.join(", "), 400, errors.array());
  }

  next();
};

module.exports = validate;
