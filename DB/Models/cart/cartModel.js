import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Cart Must Belonge to User"],
    },
    totalPrice: {
      type: Number,
      default: 0,
      // required: [true, "Cart Must have Total Price"],
    },

    priceAfterDiscount: {
      type: Number,
      default: 0,
      // required: true,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val <= this.totalPrice;
        },
        message:
          " The Price after Discount  Must be Lower than the actual price.",
      },
    },
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          // required: [true, "Product ID is required"],
        },
        quantity: {
          type: Number,
          default: 1, // Initial quantity is set to 1
        },
        price: {
          type: Number, //git it from th product
        },
        priceAfterDiscount: {
          type: Number, //git it from th product
        },
      },
    ],
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

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
