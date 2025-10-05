import ApiError from "../utils/api-error.js";

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    statusMsg: err.statusMsg,
    message: err.message,
    error: err,
    stack: err.stack,
  });

const sendErrorForProd = (err, res) =>
  res.status(err.statusCode).json({
    statusMsg: err.statusMsg,
    message: err.message,
  });

const handleJwtInvalidSignature = () => {
  return new ApiError("Invalid Token. Please login again", 401);
};

const handleJwtExpired = () => {
  return new ApiError("Token Expired. Please login again", 401);
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.statusMsg = err.statusMsg || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJwtExpired();
    sendErrorForProd(err, res);
  }
};
export default globalErrorHandler;
