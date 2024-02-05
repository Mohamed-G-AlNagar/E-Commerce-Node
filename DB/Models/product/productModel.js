import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required."],
      // unique: true,
      trim: true,
    },
    slug: {
      type: String,
      // required: [true, "Slug is required."], // auto generated using pre save middleware
      unique: true,
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
      default: function () {
        return this.finalPrice;
      }, // required: [true, "Price after discount is required."],
    },
    finalPrice: {
      type: Number,
      required: [true, "Final price is required."],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required."],
    },
    image: {
      type: String,
      required: [true, "Image URL or path is required."],
    },

    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "CategoryId is required."],
    },
    isActive: {
      // for marking false if want to soft delete the all category products then deActivate all produt
      type: Boolean,
      default: true,
      select: false,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "must have creater User Id"],
    },
  },
  {
    timestamps: true,
  }
);

//? only show marked active product when using any function begin with find
productSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});

//? 1- middleware for documents save() and create() methods only
productSchema.pre("save", function (next) {
  this.slug = slugify(this.productName, { lower: true });
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
