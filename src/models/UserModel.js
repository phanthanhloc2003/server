const mongoose = require("mongoose");
const addressSchema = require("./AddressModel");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: [addressSchema.schema],
    avata: {
      type: String,
    },
    nickname: {
      type: String,
    },
    refresh_token: { type: String },
    access_token: { type: String },
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

