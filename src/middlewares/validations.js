export const validation = (schema) => {
  return (req, res, next) => {
    const reqData = { ...req.body, ...req.params, ...req.query };
    const checkValidation = schema.validate(reqData, { abortEarly: false });

    if (checkValidation && checkValidation.error) {
      res.status(500).json({
        status: "failed",
        message: "Validation Failed",
        error: checkValidation.error.details,
      });
    } else {
      next();
    }
  };
};
