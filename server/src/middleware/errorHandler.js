function errorHandler(err, req, res, next) {
  // Basic logging (console). Could be replaced with winston or other logger.
  console.error(err.stack || err.message || err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;
