const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    company: String,
    name: String,
    selectedDistrict: String,
    selectedProvince: String,
    selectedWard: String,
    telephone: Number,
    street: String,
    value: String,
    ischeck: Boolean,
    region: { type: String, default: "Việt Nam" },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
