const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const registerUser = async (userData) => {
  const { full_name, email, password, phone, role } = userData;
  
  const user = await User.create({
    full_name,
    email,
    password,
    phone,
    role
  });

  const token = signToken(user._id);
  
  return { user, token };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw { statusCode: 401, message: 'Invalid credentials', error: 'Email or password is incorrect' };
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw { statusCode: 401, message: 'Invalid credentials', error: 'Email or password is incorrect' };
  }

  const token = signToken(user._id);

  return { user, token };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
