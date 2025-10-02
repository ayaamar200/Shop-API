// @desc  Global Error Handling Middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.statusMsg = err.statusMsg || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorForProd(err, res);
  }
};

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    statusMsg: err.statusMsg,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorForProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      statusMsg: err.statusMsg,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    return res.status(500).json({
      statusMsg: "error",
      message: "Something went very wrong!",
    });
  }
};
export default globalErrorHandler;
