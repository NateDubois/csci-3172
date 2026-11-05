const HttpError = require('../utils/HttpError');

const notFound = (req, res, next) => {
  next(new HttpError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

// Keep all four parameters, even though `next` is unused
const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;

  if (status >= 500) console.error(err);

  let message = err.message;
  if (err.type === 'entity.parse.failed') message = 'Malformed JSON in request body';
  if (status >= 500) message = 'Internal Server Error';

  res.status(status).json({
    error: {
      status,
      message,
      ...(err.details && { details: err.details }),
    },
  });
};

module.exports = { notFound, errorHandler };