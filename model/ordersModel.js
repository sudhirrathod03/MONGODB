import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  productName: String,
  price: Number,
  quantity: Number,

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
