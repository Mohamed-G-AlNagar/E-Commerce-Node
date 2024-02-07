import stripePackage from "stripe";
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

import Order from "../../DB/Models/order/orderModel.js";
import Product from "../../DB/Models/product/productModel.js";
import Cart from "../../DB/Models/cart/cartModel.js";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

// addCheckout,updateCheckout,deActiveCheckout,
// getCheckout,getAlCheckout

export const createCheckoutSession = catchAsync(async (req, res) => {
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) return AppError(res, "Cart Not Exist", 401);
  if (cart.payCashOnDelivery)
    return res.redirect(
      `https://m-alnagar.onrender.com/api/v1/orders/createOrder/${cart._id}`
    );

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `https://m-alnagar.onrender.com/api/v1/orders/createOrder/${cart._id}`,
    cancel_url: `https://m-alnagar.onrender.com/api/v1/orders/cancelOrder/${cart._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    line_items: await Promise.all(
      cart.products.map(async (product) => {
        const productDetails = await Product.findById(
          product.product.toString()
        );
        // console.log("productDetails****", productDetails);
        return {
          price_data: {
            currency: "USD",
            product_data: {
              name: productDetails.productName,
              images: [productDetails.image],
            },
            unit_amount: productDetails.priceAfterDiscount * 100,
          },
          quantity: product.quantity,
        };
      })
    ),
  });
  //   res.redirect(session.url);

  res.status(200).json({
    status: "success",
    data: {
      url: session.url,
    },
  });
});

// need to save the session to checkout model

export const createOrder = catchAsync(async (req, res) => {
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) return AppError(res, "Cart Not Exist", 401);
  let isPaid;
  cart.payCashOnDelivery ? (isPaid = false) : (isPaid = true);
  const order = await Order.create({
    user: cart.createdBy,
    totalPrice: cart.totalPrice,
    priceAfterDiscount: cart.priceAfterDiscount,
    products: [...cart.products],
    isPaid,
    payCashOnDelivery: cart.payCashOnDelivery,
  });
  res.status(200).json({
    status: "success",
    msg: "Order created Success",
    data: order,
  });
});

export const cancelOrder = catchAsync(async (req, res) => {
  res.status(404).json({
    status: "fail",
    msg: "Order Cancelled, payment Not Completed",
  });
});

export const getAllOrders = catchAsync(async (req, res) => {
  const orders = await Order.find();
  res.status(200).json({
    status: "success",
    msg: "Orders Fetched Successfully",
    ordersCount: orders.length,
    data: orders,
  });
});
export const getOrder = catchAsync(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return AppError(res, "Order Not Exist", 401);
  res.status(200).json({
    status: "success",
    msg: "Orders Fetched Successfully",
    data: order,
  });
});
