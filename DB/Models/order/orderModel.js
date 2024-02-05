import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must belong to a User!"],
    },
    totalPrice: {
      type: Number,
      require: [true, "Order must have a price."],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, " must have Id"],
        },
        quantity: {
          type: Number,
          required: [true, " must have a quantity."],
        },
        price: {
          type: Number,
          required: [true, " must have a price."],
        },
        priceAfterDiscount: {
          type: Number,
        },
      },
    ],

    isPaid: {
      type: Boolean,
      default: false, // if make in front pay cash on delivery it will hold till order delivered
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    payCashOnDelivery: {
      // if make it true in the cart, it will bypass the card online payments
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "userName email",
  }).populate({
    path: "products.product",
    select: "productName",
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
