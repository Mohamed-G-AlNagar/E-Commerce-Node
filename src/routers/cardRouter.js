import express from "express";
const cartRouter = express.Router();
import Cart from "../../DB/Models/cart/cartModel.js";

// prettier-ignore
import {createCart,updateCart,deleteCart,
  getCart,getAllMyCards,addProductToCart, removeProductFromCart
} from "../controllers/cartControllers.js";
// prettier-ignore
import {accessRestrictedTo,checkUserLogin, addMeToURL,isCreaterUserOrAdmin
} from "../middlewares/authMiddlewares.js";

// prettier-ignore
import {createCartValidation, updateCartValidation,CartIdValidation,addOrRemoveProduct
  } from "../../DB/Models/cart/cartValidatins.js";

import { validation } from "../middlewares/validations.js";
//---------------------------------------------------------

cartRouter.use(checkUserLogin);

// prettier-ignore
cartRouter.route('/')
.post(validation(createCartValidation), createCart)
.get(addMeToURL,validation(CartIdValidation),getAllMyCards)

// cartRouter.use(accessRestrictedTo("admin"));
// prettier-ignore
cartRouter
.route("/:id") // cart id // access to onlu admin or creater
.get(validation(CartIdValidation),isCreaterUserOrAdmin(Cart,"card"),getCart)
.patch(validation(updateCartValidation),isCreaterUserOrAdmin(Cart,"card"),updateCart)
.delete(validation(CartIdValidation),isCreaterUserOrAdmin(Cart,"card"),deleteCart);

cartRouter.patch(
  "/addProductToCart/:id", // cart id
  validation(addOrRemoveProduct),
  isCreaterUserOrAdmin(Cart, "card"),
  addProductToCart
);
cartRouter.patch(
  "/removeProductFromCart/:id", // cart id
  validation(addOrRemoveProduct),
  isCreaterUserOrAdmin(Cart, "card"),
  removeProductFromCart
);

export default cartRouter;
