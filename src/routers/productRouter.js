import express from "express";
const productRouter = express.Router();
import Product from "../../DB/Models/product/productModel.js";
import upload from "../middlewares/upload.js";

// prettier-ignore
import {addProduct,updateProduct,deleteProduct,
  getProduct,getAllProducts,getAllProductsByCategory,
} from "../controllers/productControllers.js";
// prettier-ignore
import {accessRestrictedTo,checkUserLogin,isCreaterUserOrAdmin
  } from "../middlewares/authMiddlewares.js";

// prettier-ignore
import {addProductValidation, updateProductValidation,productIdValidation
    } from "../../DB/Models/product/productValidations.js";

import { validation } from "../middlewares/validations.js";
//------------------------------------------------------

// allowed for every one even not logged in
productRouter.get("/", getAllProducts);
productRouter.get("/getCategoryProducts/:categoryId", getAllProductsByCategory);
productRouter.get("/:id", validation(productIdValidation), getProduct);

// allowed only for admin and sellers
productRouter.use(checkUserLogin);
productRouter.use(accessRestrictedTo("admin", "seller"));
// prettier-ignore
productRouter.post("/",upload.single("image"),validation(addProductValidation),addProduct);
// prettier-ignore
productRouter
  .route("/:id") // next will check if he is the created user or not 
  .patch( upload.single("image"),
  validation(updateProductValidation),isCreaterUserOrAdmin(Product,"product"),updateProduct)
  .delete(validation(productIdValidation), isCreaterUserOrAdmin(Product,"product"), deleteProduct);

export default productRouter;
