import Category from "../../DB/Models/category/categoryModel.js";
import Product from "../../DB/Models/product/productModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import uploadImageAndAddToReq from "../utils/cloudinaryUpload.js";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
//---------------------------------------------------

const populateObj = [
  { path: "createdBy", select: "userName " },
  { path: "updatedBy", select: "userName " },
  { path: "deletedBy", select: "userName " },
];

//---------------------------------------------------

export const addCategory = catchAsync(async (req, res) => {
  const categoryCheck = await Category.findOne({
    categoryName: req.body.categoryName,
  });
  if (categoryCheck) {
    return AppError(res, "Category Name Already Exists", 400);
  }
  // all fields already validated
  // add created by user id
  req.body.createdBy = req.user._id;
  await uploadImageAndAddToReq(req, res); // upload image to cloud and store url to the req body
  const category = await Category.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      message: "Category created successfully",
      data: category,
    },
  });
});
//---------------------------------------------------

export const getCategory = catchAsync(async (req, res) => {
  const category = await Category.findById(req.params.id)?.populate(
    populateObj
  );
  if (!category) return AppError(res, "Category not found", 401);
  res.status(200).json({
    status: "success",
    message: "category fetched successfully",
    data: {
      category,
    },
  });
});

//-------------------------------------------------------------
export const getAllCategories = catchAsync(async (req, res) => {
  //   const categorys = await Category.find().populate(populateObj);
  const queryDB = Category.find().populate(populateObj);
  const queryFeatured = new APIFeatures(queryDB, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // //? Finaly Excute Query
  const categories = await queryFeatured.queryDB;
  if (categories.length < 1) return AppError(res, "No categorys Found", 401);
  res.status(200).json({
    status: "success",
    message: "Categories fetched successfully",
    count: categories.length,
    data: {
      categories,
    },
  });
});

//---------------------------------------------------
export const updateCategory = catchAsync(async (req, res, next) => {
  //? already checked the category excist or not in prev middleware & is admin or creater user or not using n=middle ware
  // add updated by logged in user id
  req.body.updatedBy = req.user._id;
  await uploadImageAndAddToReq(req, res); // upload image to cloud and store url to the req body
  const updatedCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "category updated successfully",
    data: {
      updatedCategory,
    },
  });
});
//---------------------------------------------------
// deActive Category
export const deleteCategory = catchAsync(async (req, res) => {
  //? already checked the category excist or not in prev middleware & is admin or creater user or not using n=middle ware
  await Category.findByIdAndDelete(req.params.id);

  // const products = await Product.findMany({ categoryId: req.params.id }).map(
  //   (prod) => (prod.isActive = false)
  // );

  // products.save();
  const result = await Product.deleteMany({ categoryId: req.params.id });

  console.log("result", result);
  console.log("result.deletedCount", result.deletedCount);
  res.status(200).json({
    status: "success",
    message: "category deleted successfully",
    data: {
      deletedCount: result.deletedCount,
    },
  });
});
//---------------------------------------------------
// deActive Category
export const deActiveCategory = catchAsync(async (req, res) => {
  //? already checked the category excist or not in prev middleware & is admin or creater user or not using n=middle ware
  await Category.findByIdAndUpdate(req.params.id, {
    isActive: false,
    deletedBy: req.user._id,
  });

  const products = await Product.updateMany(
    { categoryId: req.params.id },
    { $set: { isActive: false } }
  );

  res.status(200).json({
    status: "success",
    deActiveProductsCount: products.modifiedCount,
    message: "category deActivated successfully",
  });
});
//---------------------------------------------------
//reActive Category
export const reActiveCategory = catchAsync(async (req, res) => {
  //? already checked the category excist or not in prev middleware & is admin or creater user or not using n=middle ware
  const category = await Category.updateOne(
    { _id: req.params.id },
    {
      isActive: true,
      updatedBy: req.user._id,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (category.modifiedCount === 0)
    return AppError(res, "Tjis Category Not Excist or deleted perminitly");

  const products = await Product.updateMany(
    { categoryId: req.params.id },
    { $set: { isActive: true } }
  );

  res.status(200).json({
    status: "success",
    reActiveProductsCount: products.modifiedCount,
    message: "Category andits Products reActivated successfully",
  });
});
