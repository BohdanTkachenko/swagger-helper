function NotFoundError(message = 'Not Found') {
  this.name = 'NotFoundError';
  this.message = message;
  this.stack = (new Error()).stack;
}

NotFoundError.prototype = new Error();

module.exports = NotFoundError;
