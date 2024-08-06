class ApiError extends Error {
  constructor(
    statusCode,
    message = "somethhing went wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.error = error),
      (this.stack = stack),
      (this.data = null),
      (this.message = message),
      (this.errors = error);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default ApiError;
