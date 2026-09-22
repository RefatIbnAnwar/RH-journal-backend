const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { badRequest, unauthorized } = require("../errors/AppError");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw badRequest("Please provide all required fields");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw badRequest("Email already in use");
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw badRequest("Please provide email and password");
    // test
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw unauthorized("Invalid credentials");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw unauthorized("Invalid credentials");
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};
