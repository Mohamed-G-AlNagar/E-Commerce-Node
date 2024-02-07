import crypto from "crypto";
import User from "../../DB/Models/user/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/email.js";
import { createSendToken } from "./authControllers.js";
//! forgor password functionality
export const forgotPassword = catchAsync(async (req, res) => {
  //? 1- get the user by sent email
  const user = await User.findOne({ email: req.body.email });
  // if (!user || user.email !== req.user.email) {
  //   return AppError(
  //     res,
  //     "this is not this user correct email, please try again",
  //     401
  //   );
  // }

  //? 2- generate a random token will expires in 15 minutes
  const resetToken = user.createResetPasswordToken(15);
  await user.save({ validateBeforeSave: false });

  //? 3- send email to the user with the token

  const url = `https://m-alnagar.onrender.com/api/v1/users/resetPassword/${resetToken}`;
  const subject = "Reset Password Token link will expires whithin 15 minutes";
  const message = `We've received a request to reset your password. To create a new password,
   take the below token to https://m-alnagar.onrender.com/api/v1/users/resetPassword/ as patch method :
   ${resetToken}.
   If you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject,
      url,
      message,
    });
    res.status(200).json({
      status: "success",
      message: " Verify Email link Sent To your Email",
    });
  } catch (err) {
    //? remove the reset token from the user object and save it
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return AppError(
      res,
      "There was an error sending the email. Try again later!",
      500
    );
  }
});

//----------------------------------------------------------------

export const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });
  //2- if toke not expired and user is exsists
  if (!user) {
    return AppError(
      res,
      "This token is invalid or has expired, please try again",
      400
    );
  }

  //?- set the password field = the new pass from the body
  // reset the resettoken and expire date to undefined
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  //? 5- login the user in , send JWT to him
  createSendToken(
    user,
    200,
    "Success",
    "User Password Updated Successfully",
    res
  );
});

//----------------------------------------------------------------
export const updateMyPassword = catchAsync(async (req, res, next) => {
  //1- get the user from the req which sent by the protect middleware after check that the user logged in to enter this page
  const user = await User.findById(req.user.id).select("+password");

  // 2- check if the entered current password match the user password
  if (
    !(await user.checkCorrectPassword(req.body.currentPassword, user.password))
  ) {
    return AppError(
      res,
      "The user Password is not correct, please try again",
      400
    );
  }

  //3- if so -> update the userpaswword with the new password after hashing it

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4- login the user and sent res with new token with it to the user
  createSendToken(user, 200, "Success", "password Updated successfully", res);

  //   next();
});
