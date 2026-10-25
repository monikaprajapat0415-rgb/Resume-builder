export const notFound = (req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
};

// Turn the errors Mongoose and MongoDB throw into friendly answers.
function translate(err) {
  if (err.name === 'ValidationError') {
    const details = Object.fromEntries(Object.entries(err.errors).map(([k, e]) => [k, e.message]));
    return { status: 400, message: 'Please fix the highlighted fields', details };
  }
  if (err.name === 'CastError') return { status: 400, message: `${err.path} is not valid` };
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    return { status: 409, message: `That ${field} is already used`, details: { [field]: `That ${field} is already used` } };
  }
  if (err.type === 'entity.parse.failed') return { status: 400, message: 'The request body is not valid JSON' };
  return null;
}

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const known = translate(err);
  const status = known?.status || err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: known?.message || (status >= 500 ? 'Something went wrong on the server' : err.message),
    ...((known?.details || err.details) ? { details: known?.details || err.details } : {}),
  });
};
