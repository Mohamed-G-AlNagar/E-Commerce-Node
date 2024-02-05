import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Must enter your name"],
      unique: [true, "userName already exists, please enter another userName"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Must enter your email"],
      unique: [true, "email already exists, please enter another email"],
      trim: true,
      lowercase: true,
    },
    addresses: [
      {
        type: String,
        required: true,
      },
    ],

    phone: {
      type: String,
      required: [true, "Must enter your phone number"],
      unique: [
        true,
        "phone number already exists, please enter another phone number",
      ],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Must Enter Password"],
      trim: true,
      minlength: [8, "password min lenght is 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "please enter the password again"],
      select: false,
      validate: {
        validator: function (passwordConfirm) {
          return passwordConfirm === this.password;
        },
        message: "Passwords do not match",
        // isAsync: false,
      },
    },

    passwordChangeDate: {
      type: Date,
      default: Date.now,
      // select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    verifyEmailToken: String,
    verifyEmailExpires: Date,

    isLoggedIn: {
      type: Boolean,
      default: false,
      selected: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
      // select: false,
    },

    isActive: {
      // for marking false if want to soft delete the user
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//? Virtual populate for virtually created carts field which connected to Cart Collection
userSchema.virtual("carts", {
  ref: "Cart",
  foreignField: "userId",
  localField: "_id",
});

//! middelWare to do function pre save the documents
//? 1- to hash the password and save it after check that the password field that need to be modified
userSchema.pre("save", async function (next) {
  // if not modification on password field then not continue this function
  // to pass not modified then not re-hash the pass again.
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//? Save the now date to passwordChangeDate Field auto when password changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangeDate = new Date() - 2000; // to avoid any mistake because of saving delay ( make the time  - 2sec)
  next();
});

//? only show marked active users when using any function begin with find
userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

//------------------------verify email method----------------
//? for verify Email
userSchema.methods.createVerifyEmailToken = function (
  expireTimeInMinutes = 15
) {
  const verifyToken = crypto.randomBytes(32).toString("hex");
  this.verifyEmailToken = crypto
    .createHash("sha256")
    .update(verifyToken)
    .digest("hex");

  this.verifyEmailExpires = Date.now() + expireTimeInMinutes * 60 * 1000;

  return verifyToken;
};

//-----------------------------Password methods-----------------
//? for Reset Password
userSchema.methods.createResetPasswordToken = function (
  expireTimeInMinutes = 15
) {
  const resetPasswordToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetPasswordToken)
    .digest("hex");

  this.resetPasswordExpires = Date.now() + expireTimeInMinutes * 60 * 1000;

  return resetPasswordToken;
};

//? to check if the paswword changed time after the toked created time or not.
userSchema.methods.IsPasswordChangedAfter = function (JWTCreatedTimeStamp) {
  console.log(this.passwordChangeDate, JWTCreatedTimeStamp);
  const passwordChangeTime = this.passwordChangeDate.getTime() / 1000;
  return passwordChangeTime > JWTCreatedTimeStamp;
};

//? static method on user model could access from any instance of user
userSchema.methods.checkCorrectPassword = async (
  inputPassword,
  userPassword
) => {
  return await bcrypt.compare(inputPassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
