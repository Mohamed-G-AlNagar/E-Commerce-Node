import express from "express";
const categoryRouter = express.Router();
import Category from "../../DB/Models/category/categoryModel.js";
import upload from "../middlewares/upload.js";

// prettier-ignore
import {
  addCategory,updateCategory,deActiveCategory,reActiveCategory,
  getCategory,getAllCategories,deleteCategory
} from "../controllers/categoryControllers.js";
// prettier-ignore
import {accessRestrictedTo,checkUserLogin,isCreaterUserOrAdmin
  } from "../middlewares/authMiddlewares.js";

// prettier-ignore
import {addCategoryValidation, updateCategoryValidation,CategoryIdValidation
    } from "../../DB/Models/category/categoryValidations.js";

import { validation } from "../middlewares/validations.js";
//------------------------------------------------------------------

// allowed for every one even not logged in
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/:id", validation(CategoryIdValidation), getCategory);

categoryRouter.use(checkUserLogin);

// allowed only for admin and sellers
categoryRouter.use(accessRestrictedTo("admin", "seller"));
// prettier-ignore
categoryRouter.post("/",upload.single("image"),validation(addCategoryValidation),addCategory);
// prettier-ignore
categoryRouter
.route("/:id") // next will check if he is the created user or not 
.patch(upload.single("pic"),validation(updateCategoryValidation),isCreaterUserOrAdmin(Category,"category"),updateCategory)
.delete(validation(CategoryIdValidation), isCreaterUserOrAdmin(Category,"category"), deleteCategory);

// prettier-ignore
categoryRouter.delete("/deActiveCategory/:id",validation(CategoryIdValidation), // deActivr the category and his products
isCreaterUserOrAdmin(Category, "category"),deActiveCategory);
// prettier-ignore
categoryRouter.patch("/reActiveCategory/:id",validation(CategoryIdValidation), // deActivr the category and his products
reActiveCategory);

export default categoryRouter;
