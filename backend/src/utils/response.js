const successResponse = (res, statusCode, message, data = {}, pagination = null) => {
  const response = {
    success: true,
    message,
  };
  
  // Conditionally add data and pagination to prevent empty keys if not provided
  if (data !== null) {
      if (Object.keys(data).length > 0 || Array.isArray(data)) {
        response.data = data;
      }
  }

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    message,
  };

  if (error) {
    response.error = error;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
};
