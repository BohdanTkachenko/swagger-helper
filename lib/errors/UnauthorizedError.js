function UnauthorizedError(message = 'UnauthorizedError') {
  this.name = 'UnauthorizedError';
  this.message = message;
  this.stack = (new Error()).stack;
}

UnauthorizedError.prototype = new Error();

module.exports = UnauthorizedError;
