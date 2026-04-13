const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

const register = async (req, res) => {
  const result = await authService.registerUser(req.body);
  
  // Exclude password from the response object
  const userObj = result.user.toObject();
  delete userObj.password;

  return successResponse(res, 201, 'User registered successfully', {
    user: userObj,
    token: result.token
  });
};

const login = async (req, res) => {
  const result = await authService.loginUser(req.body.email, req.body.password);

  const userObj = result.user.toObject();
  delete userObj.password;

  return successResponse(res, 200, 'Login successful', {
    user: userObj,
    token: result.token
  });
};

const logout = async (req, res) => {
  // Token invalidation handled on frontend, just return success
  return successResponse(res, 200, 'Logged out successfully');
};

const getMe = async (req, res) => {
  return successResponse(res, 200, 'User retrieved successfully', {
    user: req.user
  });
};

module.exports = {
  register,
  login,
  logout,
  getMe
};
