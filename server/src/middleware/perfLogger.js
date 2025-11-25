function perfLogger(req, res, next) {
  const start = process.hrtime();
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeMs = Math.round((diff[0] * 1e9 + diff[1]) / 1e6);
    // eslint-disable-next-line no-console
    console.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${timeMs}ms`);
  });
  next();
}

module.exports = perfLogger;
