import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: [true, "Coupon Code is Required"],
      unique: [true, "Coupon Code should be Unique"],
    },
    couponValue: {
      type: Number,
      required: [true, "Coupon Value is Required"],
      min: [1, "Coupon Value should be between 1 and 100%"],
      max: [100, "Coupon Value should be between 1 and 100%"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "must have creater User Id"],
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      select: false,
    },
    deletedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      select: false,
    },
    isActive: {
      // for marking false if want to soft delete the coupon or became expired
      type: Boolean,
      default: true,
      select: false,
    },
    expireIn: {
      type: Date,
      required: [true, "must have expire date"],
    },
  },
  {
    timestamps: true,
  }
);

//? only show marked active category when using any function begin with find
// couponSchema.pre(/^find/, function (next) {
//   this.find({ isActive: { $ne: false } });
//   next();
// });

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
