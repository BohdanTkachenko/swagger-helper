const Promise = require('bluebird');
const config = require('config');
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

      let status = err.status || 500;
      let name = err.name || 'Error';

      if (err.name === 'ValidationError') {
        status = 400;
      } else if (err instanceof errors.BadRequestError || err.name === 'BadRequestError') {
        status = 400;
        name = 'BadRequestError';
      } else if (err instanceof errors.UnauthorizedError || err.name === 'UnauthorizedError') {
        status = 401;
        name = 'UnauthorizedError';
      } else if (err instanceof errors.ForbiddenError || err.name === 'ForbiddenError') {
        status = 403;
        name = 'ForbiddenError';
      } else if (err instanceof errors.NotFoundError || err.name === 'NotFoundError') {
        status = 404;
        name = 'NotFoundError';
      }

      const result = {
        name,
        message: err.message,
      };

      if (err.errors) {
        result.errors = err.errors;
      } else if (err.error) {
        result.errors = [err.error];
      }

      if (config.has('swagger-helper.printErrors') && config.get('swagger-helper.printErrors')) {
        console.error(err.stack); // eslint-disable-line no-console
      }

      res.status(status);
      res.json(result);
    })
  ;
};
