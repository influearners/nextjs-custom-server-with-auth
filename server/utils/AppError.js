class AppError extends Error {
  constructor(message, status = '', statusCode) {
    if (!message || !status || !statusCode) {
      throw Error('Invalid AppError!');
    }
    super(message);
    this.status = status;
    this.statusCode = statusCode;
  }
}
module.exports = AppError;
