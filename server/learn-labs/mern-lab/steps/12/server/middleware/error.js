// Runs when no route matched.
export const notFound = (req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
};

// Runs when anything throws (Express 5 also forwards errors from async functions to here).
// It has four parameters: that is how Express knows it is an error handler.
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'The request body is not valid JSON' });
  const status = err.status || 500;
  if (status >= 500) console.error(err); // log real bugs, but do not leak details to the client
  res.status(status).json({
    message: status >= 500 ? 'Something went wrong on the server' : err.message,
    ...(err.details ? { details: err.details } : {}),
  });
};
