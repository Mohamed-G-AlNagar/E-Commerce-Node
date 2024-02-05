import Joi from "joi";

export const addCategoryValidation = Joi.object({
  // the user id already checked in prev middleware(valid token id) before validation check
  categoryName: Joi.string().required(),
  image: Joi.string().required(),
  //   createdBy: Joi.string().hex().min(24).max(24).required(), auto Inserted
});

export const updateCategoryValidation = Joi.object({
  // the user id already checked in prev middleware(valid token id) before validation check
  id: Joi.string().hex().min(24).max(24).required(), // category id
  categoryName: Joi.string(),
  image: Joi.string(),
  //   updatedBy: Joi.string().hex().min(24).max(24),// will be auto inserted by the id already signed in in and update
});

export const CategoryIdValidation = Joi.object({
  id: Joi.string().hex().min(24).max(24).required(), // id of the category
  //   deletedBy: Joi.string().hex().min(24).max(24),// will be auto inserted by the id already signed in in and update
});
