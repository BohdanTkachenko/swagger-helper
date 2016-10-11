function ForbiddenError(message = 'ForbiddenError') {
  this.name = 'ForbiddenError';
  this.message = message;
  this.stack = (new Error()).stack;
}

ForbiddenError.prototype = new Error();

module.exports = ForbiddenError;
