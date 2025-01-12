import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],
    totalPrice: {
        type: Number,
        default: 0,
        min: 0,
      },
      orderDate: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "shipped", "cancelled"],
        default: "pending",
      },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
