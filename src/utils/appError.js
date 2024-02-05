class newAppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const AppError = (res, errorMessage = "Something went wrong", statusCode) => {
  const err = new newAppError(errorMessage, statusCode);
  res.status(statusCode).json({
    status: "failed",
    ErrMessage: `${err.message}💥`,
    errStack: err.stack,
  });
};

export default AppError;
