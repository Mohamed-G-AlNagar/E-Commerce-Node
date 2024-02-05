import Joi from "joi";

export const signUpUserValidations = Joi.object({
  userName: Joi.string().alphanum().min(3).max(20).required(),
  email: Joi.string().email().required(),
  //   role: Joi.string().valid("user", "admin"),// not allow to enter the role (by default its user ==> change from DB to be admin or update user (auth to only admin))
  role: Joi.string().valid("user", "seller").messages({
    "string.pattern.base": "Only Allowed Roles : user or seller",
  }),
  addresses: Joi.array().items(Joi.string()).required(),
  // addresses: Joi.string().required(),

  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from @$!%*?&.",
    }),
  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
  phone: Joi.string()
    .pattern(new RegExp(/^01[0125][0-9]{8}$/))
    .required()
    .messages({
      "string.pattern.base":
        "Not Valid Phone Number, Must Start With 010/012/011/015 & total 11 digits",
    }),
});

export const loginUserValidations = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// for admin access only
export const updateUserValidations = Joi.object({
  id: Joi.string().hex().min(24).max(24).required(),
  userName: Joi.string().alphanum().min(3).max(20),
  email: Joi.string().email(),
  role: Joi.string().valid("user", "admin", "seller"),
  // addresses: Joi.string(),
  addresses: Joi.array().items(Joi.string()),
  phone: Joi.string()
    .pattern(new RegExp(/^01[0125][0-9]{8}$/))
    .messages({
      "string.pattern.base":
        "Invalid Phone Number, Must Start With 010/012/011/015 & total 11 digits",
    }),
});

export const updateMeValidations = Joi.object({
  id: Joi.string().hex().min(24).max(24).required(),
  userName: Joi.string().alphanum().min(3).max(20),
  email: Joi.string().email(),
  // role: Joi.string().valid("user", "admin"), // not allow to update my role
  addresses: Joi.array().items(Joi.string()),
});

export const forgotMyPasswordValidations = Joi.object({
  email: Joi.string().email().required(),
});

export const resetMyPasswordValidations = Joi.object({
  // new passwords
  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from @$!%*?&.",
    }),
  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
  token: Joi.string().alphanum().min(5).max(200).required(),
});

export const updateMyPasswordValidations = Joi.object({
  currentPassword: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from @$!%*?&.",
    }),

  password: Joi.string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]+$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character from @$!%*?&.",
    }),

  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match.",
  }),
});

export const userIdValidations = Joi.object({
  id: Joi.string().hex().min(24).max(24).required(),
});
