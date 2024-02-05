import Joi from "joi";

export const addProductValidation = Joi.object({
  // the user id already checked in prev middleware(valid token id) before validation checks
  productName: Joi.string().required(),
  // slug: Joi.string().required(), // auto generated and save
  priceAfterDiscount: Joi.number(),
  finalPrice: Joi.number().required(),
  stock: Joi.number().required(),
  image: Joi.string().required(),
  categoryId: Joi.string().hex().min(24).max(24).required(),
});

export const updateProductValidation = Joi.object({
  id: Joi.string().hex().min(24).max(24).required(),
  productName: Joi.string(),
  // slug: Joi.string(),
  priceAfterDiscount: Joi.number(),
  finalPrice: Joi.number(),
  stock: Joi.number(),
  image: Joi.string(),
  // category: Joi.string(),
  categoryId: Joi.string().hex().min(24).max(24),
});

// for delete & get product
export const productIdValidation = Joi.object({
  id: Joi.string().hex().min(24).max(24).required(),
});
