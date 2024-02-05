import User from "../../DB/Models/user/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

//------------------------------------------
const populateObj = {
  path: "carts",
  select: "-__v -id", // not show this fields
};

const filterObj = (obj, ...filteringBy) => {
  console.log(filteringBy);
  const filteredObj = {};
  Object.keys(obj).forEach((ele) => {
    if (filteringBy.includes(ele)) {
      filteredObj[ele] = obj[ele];
    }
  });
  return filteredObj;
};

//------------------------------------------

// for admin only
//----------------------------------------------
//! 1- get All  Function
export const getAllUsers = catchAsync(async (req, res) => {
  const queryDB = User.find().select("-passwordChangeDate -verifyEmailExpires");
  const queryFeatured = new APIFeatures(queryDB, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // //? Finaly Excute Query
  const Users = await queryFeatured.queryDB;

  if (!Users.length) {
    return AppError(res, "This Collection is empty", 500);
  }

  res.status(200).json({
    status: "Successfully Fetched",
    count: Users.length,
    // requestTime: req.requestTimeStamp,
    data: {
      data: Users,
    },
  });
});

//-----------------------------------------

// ! 2- get one by id
export const getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).populate(populateObj);

  if (!user) return AppError(res, `This user Id is  Not Exists`, 404);

  const filteredUser = {
    email: user.email,
    userName: user.userName,
    role: user.role,
    carts: user.carts,
    addresses: user.addresses,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
  res.status(200).json({
    status: "success",
    //   requestTime: req.requestTimeStamp,
    data: {
      message: "Successfully Fetched",
      data: filteredUser,
    },
  });
});

//-----------------------------------------

// ! 5- Delete one  function by id
export const deleteUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return AppError(res, `This Id Not Exists`, 404);
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "Deleted Successfully",
  });
});

//-----------------------------------------
export const updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return AppError(res, "password updating not allowed from here", 401);
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return AppError(res, `This Id Not Exists`, 404);
  }

  // 2- filter the incoming data in the req.body to exclude what not allowd to be updated (role, password)
  const roleIfAdmin = req.user.role === "admin" ? "role" : "";
  const filteredInputData = filterObj(
    req.body,
    "userName",
    "email",
    "addresses",
    roleIfAdmin
  );

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredInputData,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      message: "Successfully Updated",
      data: updatedUser,
    },
  });
});

//---------------------------------------------------

//!  Users Collection Routes Handlers Functions

// not delete the user- just deactivate him to not show in searches
export const deActiveMe = catchAsync(async (req, res, next) => {
  // the usr is already signedin
  // 1- find the user by id and update his active flag to false
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(201).json({
    status: "success",
    data: {
      message: "user deleted successfully",
      data: null,
    },
  });
});
