// Wraps an async Express route handler so that any rejected promise
// automatically calls next(error) — eliminating try/catch boilerplate.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
