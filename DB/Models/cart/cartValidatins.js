import Joi from "joi";

export const createCartValidation = Joi.object({
  // createdBy: Joi.string().hex().min(24).max(24), // already checked before this and will added auto to the card
  totalPrice: Joi.number(),
  priceAfterDiscount: Joi.number(),
  // products: Joi.array().items(Joi.string()),
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().hex().required(),
      quantity: Joi.number().integer().min(1),
    })
  ),
});

export const updateCartValidation = Joi.object({
  id: Joi.string().hex().min(24).max(24).required(),
  totalPrice: Joi.number(),
  priceAfterDiscount: Joi.number(),
  // products: Joi.array().items(Joi.string()),
  products: Joi.array().items(
    Joi.object({
      product: Joi.string().hex(),
      quantity: Joi.number().integer().min(1),
    })
  ),
});

export const addOrRemoveProduct = Joi.object({
  id: Joi.string().hex().min(24).max(24).required(),
  productId: Joi.string().hex().min(24).max(24).required(),
  quantity: Joi.number().integer().min(1),
});
export const CartIdValidation = Joi.object({
  id: Joi.string().hex().min(24).max(24).required(),
});
