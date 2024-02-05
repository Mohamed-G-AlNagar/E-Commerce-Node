import express from "express";
const couponRouter = express.Router();
import Coupon from "../../DB/Models/coupon/couponModel.js";

// prettier-ignore
import {addCoupon,updateCoupon,deleteCoupon,
  getCoupon,getAllCoupons,applyCouponToProductInCart, applyCouponToCart,applySaleToProduct
} from "../controllers/couponControllers.js";
// prettier-ignore
import {accessRestrictedTo,checkUserLogin,isCreaterUserOrAdmin
  } from "../middlewares/authMiddlewares.js";

// prettier-ignore
import {createCouponValidation, updateCouponValidation,couponIdValidation,
  applyCouponToCartValidation, applyCouponToProductValidation,applySaleCouponToProductValidation
    } from "../../DB/Models/coupon/couponValidations.js";

import { validation } from "../middlewares/validations.js";
//------------------------------------------------------------------

couponRouter.use(checkUserLogin);

// prettier-ignore
couponRouter.post("/applyCouponToProductInCart/:couponCode", validation(applyCouponToProductValidation), applyCouponToProductInCart); //using Coupon Code
// prettier-ignore
couponRouter.post("/applyCouponToCart/:couponCode", validation(applyCouponToCartValidation), applyCouponToCart); //using Coupon Code

// allowed only for admin and sellers
couponRouter.use(accessRestrictedTo("admin", "seller"));
// prettier-ignore
couponRouter.post("/applySaleToProduct/:couponCode",validation(applySaleCouponToProductValidation), applySaleToProduct); //using Coupon Code
// prettier-ignore
couponRouter.route("/")
.get(accessRestrictedTo("admin"),getAllCoupons)
.post(validation(createCouponValidation), addCoupon);
// prettier-ignore
couponRouter
  .route("/:id") //coupon id => next will check if he is the created user or not 
  .get( validation(couponIdValidation),isCreaterUserOrAdmin(Coupon,"coupon"), getCoupon)
  .patch(validation(updateCouponValidation),isCreaterUserOrAdmin(Coupon,"coupon"),updateCoupon)
  .delete(validation(couponIdValidation), isCreaterUserOrAdmin(Coupon,"coupon"), deleteCoupon);

export default couponRouter;
