import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Category name is required."],
      unique: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
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
      // for marking false if want to soft delete the category
      type: Boolean,
      default: true,
      select: false,
    },
    image: {
      type: String,
      required: [true, "Image URL or path is required."],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//? Virtual populate for virtually created products field which connected to Cart Collection
categorySchema.virtual("products", {
  ref: "Product",
  foreignField: "categoryId",
  localField: "_id",
});

//? only show marked active category when using any function begin with find
categorySchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });

  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;
