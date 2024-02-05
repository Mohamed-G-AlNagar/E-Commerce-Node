import Cart from "../../DB/Models/cart/cartModel.js";
import Product from "../../DB/Models/product/productModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const populateObj = [
  { path: "createdBy", select: "userName email " },
  { path: "products.product", select: "-__v -id" },
];
//---------------------------------------------------

export const createCart = catchAsync(async (req, res) => {
  // all fields already validated
  req.body.createdBy = req.user._id; // addd the loggedin user id to the created card

  const cart = await Cart.create(req.body);
  res.status(201).json({
    status: "success",
    message: "cart created successfully",
    data: {
      productsCount: cart.products.length,
      data: cart,
    },
  });
});
//---------------------------------------------------

export const getCart = catchAsync(async (req, res) => {
  const cart = await Cart.findById(req.params.id)?.populate(populateObj);
  if (!cart) return AppError(res, "Cart not found", 401);
  res.status(200).json({
    status: "success",
    message: "cart fetched successfully",
    data: {
      productsCount: cart.products.length,
      cart,
    },
  });
});
//---------------------------------------------------
export const getAllMyCards = catchAsync(async (req, res) => {
  const carts = await Cart.find({ createdBy: req.user._id }).populate(
    populateObj
  );
  if (carts.length < 1) return AppError(res, "You have no carts", 401);
  res.status(200).json({
    status: "success",
    message: "carts fetched successfully",
    data: {
      carts,
    },
  });
});
//---------------------------------------------------
export const deleteCart = catchAsync(async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return AppError(res, "Cart not found", 401);
  await Cart.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      message: "cart deleted successfully",
    },
  });
});
//---------------------------------------------------
export const updateCart = catchAsync(async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return AppError(res, "Cart not found", 401);

  req.body.createdBy = req.user._id; // addd the loggedin user id to the created card
  const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    message: "cart updated successfully",
    data: {
      productsCount: cart.products.length,
      updatedCart,
    },
  });
});

//------------------------------------------------------

export const addProductToCart = catchAsync(async (req, res) => {
  const product = await Product.findById(req.body.productId);
  if (!product) return AppError(res, "Product not excist", 401);

  const cart = await Cart.findById(req.params.id);

  if (!cart) return AppError(res, "Cart not excist", 401);

  const productIndex = cart.products.findIndex(
    (p) => String(p.product) === req.body.productId
  );

  if (productIndex !== -1) {
    cart.products[productIndex].quantity += req.body.quantity || 1;
  } else {
    cart.products.push({
      product: req.body.productId,
      quantity: req.body.quantity || 1,
      price: product.finalPrice,
      priceAfterDiscount: product.priceAfterDiscount,
    });
  }

  // update the cart price after new product added
  cart.totalPrice += product.finalPrice * (req.body.quantity || 1);
  cart.priceAfterDiscount +=
    product.priceAfterDiscount * (req.body.quantity || 1);

  const updatedCart = await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product Added to the cart successfully",
    data: {
      productsCount: cart.products.length,
      updatedCart,
    },
  });
});

//---------------------------------------------

export const removeProductFromCart = catchAsync(async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) return AppError(res, "Cart not excist", 401);
  const product = await Product.findById(req.body.productId);
  if (!product) return AppError(res, "Product not excist", 401);

  const productIndex = cart.products.findIndex(
    (p) => String(p.product) === req.body.productId
  );

  if (productIndex === -1)
    return AppError(res, "Product not found in the cart", 401);

  // If quantity becomes zero or less, remove the product from the array
  if (cart.products[productIndex].quantity === 0) {
    cart.products.splice(productIndex, 1);
  } else {
    cart.products[productIndex].quantity -= req.body.quantity || 1;
  }

  // update the cart price after  product removed
  cart.totalPrice -= product.finalPrice * (req.body.quantity || 1);
  cart.priceAfterDiscount -=
    product.priceAfterDiscount * (req.body.quantity || 1);

  const updatedCart = await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product removed from th cart successfully",
    data: {
      productsCount: cart.products.length,
      data: updatedCart,
    },
  });
});
