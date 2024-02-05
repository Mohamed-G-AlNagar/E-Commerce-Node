import Coupon from "../../DB/Models/coupon/couponModel.js";
import Cart from "../../DB/Models/cart/cartModel.js";
import Product from "../../DB/Models/product/productModel.js";
import APIFeatures from "../utils/apiFeatures.js";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
//---------------------------------------------------

const populateObj = [
  { path: "createdBy", select: "userName " },
  { path: "updatedBy", select: "userName " },
  { path: "deletedBy", select: "userName " },
];

//---------------------------------------------------

export const addCoupon = catchAsync(async (req, res) => {
  const couponCheck = await Coupon.findOne({
    couponName: req.body.couponCode,
  });
  if (couponCheck) {
    return AppError(res, "Coupon Code Already Exists", 400);
  }
  req.body.createdBy = req.user._id;
  // all fields already validated
  const coupon = await Coupon.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Coupon created successfully",
    data: {
      coupon,
    },
  });
});
//---------------------------------------------------

export const getCoupon = catchAsync(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)?.populate(populateObj);
  if (!coupon) return AppError(res, "Coupon not found", 401);
  res.status(200).json({
    status: "success",
    message: "coupon fetched successfully",
    data: {
      coupon,
    },
  });
});

//-------------------------------------------------------------
export const getAllCoupons = catchAsync(async (req, res) => {
  //   const coupons = await Coupon.find().populate(populateObj);
  const queryDB = Coupon.find().populate(populateObj);
  const queryFeatured = new APIFeatures(queryDB, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // //? Finaly Excute Query
  const coupons = await queryFeatured.queryDB;
  if (coupons.length < 1) return AppError(res, "No coupons Found", 401);
  res.status(200).json({
    status: "success",
    message: "coupons fetched successfully",
    Coupons: coupons.length,
    data: {
      coupons,
    },
  });
});
//---------------------------------------------------
// deActive Coupon
export const deleteCoupon = catchAsync(async (req, res) => {
  // already checked the coupon excist or not in preverios middleware & is admin or creater user or not using n=middle ware

  await Coupon.findByIdAndUpdate(req.params.id, {
    isActive: false,
    deletedBy: req.user._id,
  });
  res.status(200).json({
    status: "success",
    data: {
      message: "coupon deleted successfully",
    },
  });
});
//---------------------------------------------------
export const updateCoupon = catchAsync(async (req, res, next) => {
  // already checked the coupon excist or not in preverios middleware & is admin or creater user or not using n=middle ware
  req.body.updatedBy = req.user._id;
  const updatedCoupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    message: "coupon updated successfully",
    data: {
      updatedCoupon,
    },
  });
});

//-------------------------------------------------
export const applyCouponToProductInCart = catchAsync(async (req, res) => {
  const coupon = await Coupon.findOne({ couponCode: req.params.couponCode });
  if (!coupon) return AppError(res, "Coupon not found", 401);

  if (coupon.isActive == false)
    return AppError(res, "Coupon is expired or deActivated", 401);

  const cart = await Cart.findById(req.body.cartId);
  if (!cart) AppError(res, "Coupon not found", 401);

  const product = cart.products.find(
    (prod) => String(prod.product) == req.body.productId
  );

  if (!product) return AppError(res, "Product not found in the cart", 401);
  const discount = (product.price * coupon.couponValue) / 100;
  product.priceAfterDiscount = product.price - discount;
  await cart.save();

  coupon.isActive = false;
  await coupon.save();

  res.status(200).json({
    status: "success",
    message: "Coupon Successfully Applied To the Product",
    data: {
      ProductId: product._id,
      finalBeforeDiscount: product.finalPrice,
      priceAfterDiscount: product.priceAfterDiscount,
    },
  });
});
//-------------------------------------------------
// apply it only in front when going to payment
export const applyCouponToCart = catchAsync(async (req, res) => {
  const coupon = await Coupon.findOne({ couponCode: req.params.couponCode });
  if (!coupon) return AppError(res, "Coupon not found", 401);
  if (coupon.isActive == false)
    return AppError(res, "Coupon is expired or deActivated", 401);

  const cart = await Cart.findById(req.body.cartId);
  if (!cart) return AppError(res, "Product not found", 401);

  if (cart.totalPrice === 0) return AppError(res, "Add Products First", 401);
  if (cart.priceAfterDiscount !== cart.totalPrice)
    return AppError(
      res,
      "There is discount Coupon already applied to his cart products",
      401
    );

  const discount = (cart.totalPrice * coupon.couponValue) / 100;
  cart.priceAfterDiscount = cart.totalPrice - discount;
  await cart.save();

  coupon.isActive = false;
  await coupon.save();

  res.status(200).json({
    status: "success",
    message: "Coupon Successfully Applied To the Product",
    data: {
      cart,
    },
  });
});
//-------------------------------------------------
export const applySaleToProduct = catchAsync(async (req, res) => {
  const coupon = await Coupon.findOne({ couponCode: req.params.couponCode });
  if (!coupon) return AppError(res, "Coupon not found", 401);

  if (coupon.createdBy.toString() !== req.user._id && req.user.role !== "admin")
    return AppError(res, "This Coupon don't belonge to u ", 401);

  if (coupon.isActive == false)
    return AppError(res, "Coupon is expired or deActivated", 401);

  const product = await Product.findById(req.body.productId);
  if (!product) return AppError(res, "Product not found", 401);

  if (
    product.createdBy.toString() !== req.user._id &&
    req.user.role !== "admin"
  )
    return AppError(res, "This product don't belonge to u ", 401);

  const discount = (product.finalPrice * coupon.couponValue) / 100;
  product.priceAfterDiscount = product.finalPrice - discount;
  await product.save();

  coupon.isActive = false;
  await coupon.save();

  res.status(200).json({
    status: "success",
    message: "Coupon Sale Successfully Applied To the Product",
    data: {
      ProductId: product._id,
      productName: product.productName,
      finalBeforeDiscount: product.finalPrice,
      priceAfterDiscount: product.priceAfterDiscount,
    },
  });
});
