import Joi from "joi";

export const createCouponValidation = Joi.object({
  //   createdBy: Joi.string().hex().min(24).max(24).required(), auto Inseted
  couponCode: Joi.string().alphanum().min(3).max(10).required(),
  couponValue: Joi.number().min(1).max(100).required(),
  expireIn: Joi.date().required(),
});

export const updateCouponValidation = Joi.object({
  //   updatedBy: Joi.string().hex().min(24).max(24),// will be auto inserted by the id already signed in in and update
  couponCode: Joi.string().alphanum().min(3).max(10),
  couponValue: Joi.number().min(1).max(100),
  expireIn: Joi.date(),
});

export const applyCouponToProductValidation = Joi.object({
  //   updatedBy: Joi.string().hex().min(24).max(24),// will be auto inserted by the id already signed in in and update
  couponCode: Joi.string().alphanum().min(3).max(10).required(), // instead of using id
  cartId: Joi.string().hex().min(24).max(24).required(),
  productId: Joi.string().hex().min(24).max(24).required(), // id of product
});
export const applySaleCouponToProductValidation = Joi.object({
  //   updatedBy: Joi.string().hex().min(24).max(24),// will be auto inserted by the id already signed in in and update
  couponCode: Joi.string().alphanum().min(3).max(10).required(), // instead of using id
  productId: Joi.string().hex().min(24).max(24).required(), // id of product
});

export const applyCouponToCartValidation = Joi.object({
  //   updatedBy: Joi.string().hex().min(24).max(24),// will be auto inserted by the id already signed in in and update
  couponCode: Joi.string().alphanum().min(3).max(10).required(), // instead of using id
  cartId: Joi.string().hex().min(24).max(24).required(), // id  cart
});

export const couponIdValidation = Joi.object({
  id: Joi.string().hex().min(24).max(24).required(),
});
