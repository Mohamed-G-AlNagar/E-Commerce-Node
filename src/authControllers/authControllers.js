import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../../DB/Models/user/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/email.js";

//-------------------------------
const signToken = (user, expireWithin = process.env.JWT_EXPIRES_IN) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_KEY, {
    // default is 90d written in config.env file
    expiresIn: expireWithin,
  });
};

// creat the token and send it in cookie not in url to be secured and in production will be https
export const createSendToken = (user, statusCode, statusmsg, message, res) => {
  // check if maarked loginn then make the token available within extentended date if not make it expired
  const tokenExpire = user.isLoggedIn ? process.env.JWT_EXPIRES_IN : "0d";
  const token = signToken(user, tokenExpire);

  const cookieExpireWithin = user.isLoggedIn
    ? process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    : -1000;

  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireWithin),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined; // to not show the password in the response

  const logInRes = {
    id: user._id,
    email: user.email,
    userName: user.userName,
    isVerified: user.isVerified,
    isLoggedIn: user.isLoggedIn,
    role: user.role,
  };
  const logOutRes = { id: user._id, email: user.email };

  res.status(statusCode).json({
    status: statusmsg,
    message: message,
    token: user.isLoggedIn ? token : "",
    data: user.isLoggedIn ? logInRes : logOutRes,
  });
};
//-------------------------------------------------
export const signup = catchAsync(async (req, res, next) => {
  const userCheck = await User.findOne({
    email: req.body.email,
  });
  if (userCheck) {
    return AppError(res, "Email Already Exists", 400);
  }
  const newUser = await User.create({
    //? not give him all incomming data from body request
    // ? just pass to the schema model only the required data to save ( to avoid any incomming data not required and could harm )
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    addresses: req.body.addresses,
    phone: req.body.phone,
    role: req.body.role,
  });

  // make token expire within 15 minites
  const token = newUser.createVerifyEmailToken(15);
  await newUser.save({ validateBeforeSave: false });
  const url = `https://m-alnagar.onrender.com/api/v1/users/verify/${token}`;
  const subject = "Verify Email link will expires whithin 15 minutes";
  const message = `Thank you for signing up! To complete your registration,
  please click on the verification link below.
  This link will expire within 15 minutes.
  Verification toke:
  [${token}]
  Best regards Al-NaGar Store😎`;

  try {
    await sendEmail({
      email: newUser.email,
      subject,
      url,
      message,
    });
    res.status(200).json({
      status: "success",
      message: " Verify Email link Sent To your Email",
    });
  } catch (err) {
    //? remove the verify token from the user object and save it
    newUser.verifyEmailToken = undefined;
    newUser.verifyEmailExpires = undefined;
    await newUser.save({ validateBeforeSave: false });

    return (
      AppError(res, "There was an error sending the email. Try again later!"),
      500
    );
  }
});
//------------------------------------------------
// User Verification
export const verifyAccount = catchAsync(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // get the user by the token and the expire date should greater than now time
  const user = await User.findOne({
    verifyEmailToken: hashedToken,
    verifyEmailExpires: { $gt: new Date() },
  });
  //2- if toke not expired and user is exsists
  if (!user) {
    return AppError(
      res,
      "This token is invalid or has expired, please try again",
      400
    );
  }

  //? mark the user as verified
  user.isVerified = true;
  user.verifyEmailToken = undefined;
  await user.save();
  //? 5- login the user in , send JWT to him
  createSendToken(
    user,
    200,
    "Success",
    "User Email Verified Successfully",
    res
  );
});
//------------------------------------------------
export const login = catchAsync(async (req, res, next) => {
  // distractering the req.body to get only this two parameters
  const { email, password } = req.body;

  //? 1- check if user sent both email & password or not (then return our custom error called AppError)
  if (!email || !password) {
    return AppError(res, "Please Provide both email and password", 401);
  }

  //? 2- get the user obj by email an include in it the pass
  const user = await User.findOne({ email }).select("+password +isVerified");

  //3- check if the user email is not verfied email
  if (!user) {
    return AppError(res, "this email is not a valid email", 401);
  }

  if (!user.isVerified) {
    return AppError(res, "Please verify your email", 401);
  }

  //? 3- check if the user email excist & password is correct
  if (!user || !(await user.checkCorrectPassword(password, user.password))) {
    return AppError(res, "Incrorrect email or password", 401);
  }

  // If the user is already logged in with a different account, ask them to log out first
  const tokenUserId = jwt.decode(req.cookies.jwt)?.id;
  if (tokenUserId && tokenUserId !== user._id.toString()) {
    return AppError(
      res,
      `Please log out first with this Id user (${tokenUserId}) to log in with a different user`,
      401
    );
  }

  const loggedInUser = await User.findByIdAndUpdate(
    user._id,
    { isLoggedIn: true },
    { new: true }
  );

  //? make token with this user id
  createSendToken(
    loggedInUser,
    200,
    "success",
    "user logged in successfully",
    res
  );
});
//------------------------------------------------

// at the router i will make the middleware of check user login first before enter this function
export const logout = catchAsync(async (req, res, next) => {
  const loggedInUser = await User.findByIdAndUpdate(
    req.user._id,
    { isLoggedIn: false },
    { new: true }
  );

  //? make token with this user id expired by marking the user as loggedin= false
  createSendToken(
    loggedInUser,
    200,
    "Success",
    "user logged out successfully",
    res
  );
});
