function BadRequestError(message = 'BadRequestError') {
  this.name = 'BadRequestError';
  this.message = message;
  this.stack = (new Error()).stack;
}

BadRequestError.prototype = new Error();

module.exports = BadRequestError;
