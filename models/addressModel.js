const mongoose = require("mongoose");

const addressModel = new mongoose.Schema(
  {
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    area: {
      type: String,
    },
    pincode: {
      type: String,
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("address", addressModel);

module.exports = Address;
