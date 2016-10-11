const Promise = require('bluebird');
const mongoose = require('mongoose');
const debug = require('debug')('swagger-helper:action');
const errors = require('./errors');

module.exports = fn => (req, res, next) => {
  const params = {};
  for (const key of Object.keys(req.swagger.params)) {
    params[key] = req.swagger.params[key].value;
  }

  Promise.method(fn)(params, req, res, next)
    .then(result => res.json(result))
    .catch((err) => {
      debug(err.stack);

      let status = 500;
      if (err instanceof mongoose.Error.ValidationError) {
        status = 400;
      } else if (err instanceof errors.BadRequestError) {
        status = 400;
      } else if (err instanceof errors.UnauthorizedError) {
        status = 401;
      } else if (err instanceof errors.ForbiddenError) {
        status = 403;
      } else if (err instanceof errors.NotFoundError) {
        status = 404;
      }

      const result = {
        name: err.name || 'Error',
        message: err.message,
      };

      if (err.errors) {
        result.errors = err.errors;
      } else if (err.error) {
        result.errors = [err.error];
      }

      console.error(err.stack); // eslint-disable-line no-console
      res.status(status);
      res.json(result);
    })
  ;
};
