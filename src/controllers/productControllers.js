import Product from "../../DB/Models/product/productModel.js";
import Category from "../../DB/Models/category/categoryModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import uploadImageAndAddToReq from "../utils/cloudinaryUpload.js";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

//--------------------------------------------
const populateObj = [{ path: "categoryId", select: "categoryName " }];
//---------------------------------------------------

export const addProduct = catchAsync(async (req, res) => {
  // const productCheck = await Product.findOne({
  //   productName: req.body.productName,
  // });
  // if (productCheck) {
  //   return AppError(res, "Product Name Already Exists", 400);
  // }

  // all fields already validated
  await uploadImageAndAddToReq(req, res); // upload image to cloud and store url to the req body
  const product = await Product.create(req.body);
  res.status(201).json({
    status: "success",
    message: "product created successfully",
    data: {
      data: product,
    },
  });
});
//---------------------------------------------------

export const getProduct = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id)?.populate(populateObj);
  if (!product) return AppError(res, "Product not found", 401);
  res.status(200).json({
    status: "success",
    message: "product fetched successfully",
    data: {
      data: product,
    },
  });
});

//---------------------------------------------------

export const getAllProducts = catchAsync(async (req, res) => {
  //   const products = await Product.find().populate(populateObj);
  const queryDB = Product.find()?.populate(populateObj);
  const queryFeatured = new APIFeatures(queryDB, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // //? Finaly Excute Query
  const products = await queryFeatured.queryDB;
  if (products.length < 1) return AppError(res, "No products Found", 401);
  res.status(200).json({
    status: "success",
    count: products.length,
    message: "products fetched successfully",
    data: {
      data: products,
    },
  });
});
//---------------------------------------------------

export const getAllProductsByCategory = catchAsync(async (req, res) => {
  const queryDB = Product.find({
    categoryId: req.params.categoryId,
  });
  const queryFeatured = new APIFeatures(queryDB, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // //? Finaly Excute Query
  const products = await queryFeatured.queryDB;
  if (products.length < 1) return AppError(res, "No products Found", 401);
  const category = await Category.findById(req.params.categoryId);
  res.status(200).json({
    status: "success",
    count: products.length,
    categoryName: category.categoryName,
    categoryId: category._id,
    data: {
      message: "products fetched successfully",
      data: products,
    },
  });
});
//---------------------------------------------------
export const deleteProduct = catchAsync(async (req, res) => {
  // const product = await Product.findById(req.params.id);
  // if (!product) return AppError(res, "Product not found", 401);

  // already checked the product excist or not & is admin or creater user or not using n=middleware
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      message: "product deleted successfully",
    },
  });
});
//---------------------------------------------------
export const updateProduct = catchAsync(async (req, res, next) => {
  // const product = await Product.findById(req.params.id);
  // if (!product) return AppError(res, "Product not found", 401);

  // already checked the product excist or not & is admin or creater user or not using n=middleware
  await uploadImageAndAddToReq(req, res); // upload image to cloud and store url to the req body
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate(populateObj);
  res.status(200).json({
    status: "success",
    data: {
      message: "product updated successfully",
      data: updatedProduct,
    },
  });
});
