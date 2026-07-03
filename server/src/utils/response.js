// Send a consistent success response
const sendSuccess = (res, statusCode = 200, data = {}) => {
  res.status(statusCode).json({ success: true, ...data });
};

// Send a consistent error response (supports dev-only stack trace)
const sendError = (res, statusCode, message, extra = {}) => {
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && extra),
  });
};

module.exports = { sendSuccess, sendError };
