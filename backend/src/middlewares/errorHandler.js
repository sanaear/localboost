const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ message, status });
};

module.exports = errorHandler;
