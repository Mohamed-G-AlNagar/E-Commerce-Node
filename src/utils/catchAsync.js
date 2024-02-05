//? function to remove try catch from all async function and use it instead to handle catch error

const catchAsync = (fun) => {
  return (req, res, next) => {
    fun(req, res, next).catch((err) => {
      console.error("err => ", err);
      handleError(res, err);
      // next(err);
    });
  };
};

function handleError(res, err) {
  if (err.code === 11000) {
    const keyValueString = JSON.stringify(err.keyValue);
    err.msg = `Duplicated Key, ${keyValueString}`;
  } else if (err.name === "CastError") {
    err.msg = "User not found";
  } else if (
    err.name == "TokenExpiredError" ||
    err.name == "JsonWebTokenError"
  ) {
    err.msg = "Please Login Again";
  } else {
    err.msg = "Something went wrong";
  }
  console.log(err);
  res.status(500).json({
    status: "failed",
    ErrMessage: `${err.msg}💥`,
    Error: err.message,
    errStack: err.stack,
  });
}

export default catchAsync;
