const AppError = require("../utils/appError");

const hanldeJwtTokenExpiredError = () => {
  return new AppError(401, "Invalid authentication token . please log in again.");
};

const handleDuplicateErrorDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  return new AppError(
    409,
    `${field} :'${value}' already exists. Please use another ${field}.`,
  );
};

const handleCastErrorDB = (err) => {
  const message = `Invalid path : ${err.path} and value : ${err.value} `;
  return new AppError(400, message);
};

const handleValidatorErrorDB = (err) => {
  const errorMessage = Object.values(err.errors)
    .map((doc) => doc.message)
    .join(". ");

  return new AppError(400, `validation Error: ${errorMessage}`);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: "Error",
      message: "something went worng...💥",
    });
  }
};

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = Object.create(err);

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "ValidationError") error = handleValidatorErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === "TokenExpiredError")
      error = hanldeJwtTokenExpiredError();
    sendProdError(error, res);
  }
};

module.exports = globalError;
