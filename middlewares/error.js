function errorHandler(error, req, res, next) {
  error.statusCode = error.statusCode || 500;

  res.status(error.statusCode).send({
    status: error.statusCode,
    message: error.message,
  });
}

module.exports = {
  errorHandler,
};
