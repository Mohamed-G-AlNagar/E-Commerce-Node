import express from "express";
const orderRouter = express.Router();

// prettier-ignore
import {cancelOrder, createCheckoutSession, createOrder,
  getAllOrders,getOrder
  } from "../controllers/checkout.OrderControllers.js";
// prettier-ignore
import {accessRestrictedTo,checkUserLogin
    } from "../middlewares/authMiddlewares.js";

orderRouter.route("/createOrder/:cartId").get(createOrder); // make it without check logging in just to see the response from the browser
orderRouter.route("/cancelOrder/:cartId").get(cancelOrder); // make it without check logging in just to see the response from the browser

orderRouter.use(checkUserLogin); // check if logged in or not

orderRouter.get("/checkout-session/:cartId", createCheckoutSession);

orderRouter.use(accessRestrictedTo("admin")); // only acces for admin

orderRouter.route("/").get(getAllOrders);
orderRouter.get("/:id", getOrder);

export default orderRouter;
