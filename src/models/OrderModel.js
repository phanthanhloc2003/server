const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: [],
    shippingAddress: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    totalPrice: {
      type: Number,
    },
    address: {
      type: Object,
    },
    id: {
      type: String,
    },
   
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
