// Middleware = a function that runs before your route. It can look at the request, change it,
// answer it, or call next() to pass it along.
export function logger(req, res, next) {
  const started = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - started} ms)`);
  });
  next();
}
