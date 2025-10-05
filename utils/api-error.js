class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusMsg = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.statusCode = statusCode;
    this.isOperational = true; // To distinguish operational errors from programming errors
  }
}
export default ApiError;
