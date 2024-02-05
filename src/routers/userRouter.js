import express from "express";
const userRouter = express.Router();
import cookieParser from "cookie-parser";

// prettier-ignore
import {getAllUsers,getUser,updateUser,deleteUser,deActiveMe,
} from "../controllers/userControllers.js";

// prettier-ignore
import {signup,verifyAccount,login,logout
} from "../authControllers/authControllers.js";

// prettier-ignore
import {forgotPassword,resetPassword,updateMyPassword,
} from "../authControllers/forget.reset.updateMyPassword.js";

// prettier-ignore
import {addMeToURL,accessRestrictedTo,checkUserLogin,
} from "../middlewares/authMiddlewares.js";

// prettier-ignore
import {signUpUserValidations,loginUserValidations,updateUserValidations,userIdValidations,
  updateMeValidations,resetMyPasswordValidations,updateMyPasswordValidations,forgotMyPasswordValidations
} from "../../DB/Models/user/userValidations.js";

import { validation } from "../middlewares/validations.js";
//--------------------------------------------------------------

userRouter.use(cookieParser());
// inside the login will check the isverified email and issue token if verified
userRouter.post("/login", validation(loginUserValidations), login);
userRouter.post("/signup", validation(signUpUserValidations), signup);
// prettier-ignore

userRouter.get("/verify/:token", verifyAccount);

// prettier-ignore
userRouter.post("/forgotPassword",validation(forgotMyPasswordValidations), forgotPassword);
// prettier-ignore
userRouter.patch('/resetPassword/:token',validation(resetMyPasswordValidations), resetPassword);
//------------------------------------------------------------
//! All following end points need to be loged in to access
//? midle ware of checkUserLogin applied to all following
userRouter.use(checkUserLogin);

userRouter.post("/logout", logout);

//? control my account
// noting that add me to url is to reuse the getuser - update user functions
userRouter
  .route("/me")
  .get(addMeToURL, validation(userIdValidations), getUser)
  .patch(addMeToURL, validation(updateMeValidations), updateUser)
  .delete(addMeToURL, validation(userIdValidations), deActiveMe); // this is soft delet (deActive the account)

// prettier-ignore
userRouter.patch("/me/updatePassword",
  validation(updateMyPasswordValidations),
  updateMyPassword
);
//------------------------------------------------------------
//! follwing endpoint restricted to only admin
userRouter.use(accessRestrictedTo("admin"));
// prettier-ignore
userRouter
.get("/",getAllUsers); //? accept query options applied on it (filter, fields, sort, paginate,....)

// prettier-ignore
userRouter
.route("/:id")
.patch(validation(updateUserValidations),updateUser)
.get(validation(userIdValidations),getUser)
.delete(validation(userIdValidations),deleteUser);
//------------------------------------------------------------
export default userRouter;
