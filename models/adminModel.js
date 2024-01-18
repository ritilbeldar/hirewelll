const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminModel = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
      select: false,
      maxLength: [15, "Password should not exceed more than 15 characters"],
      minLength: [6, "Password should have atleast 6 characters"],
    },
  },
  { timestamps: true }
);

adminModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

adminModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

adminModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Admin = mongoose.model("admin", adminModel);

module.exports = Admin;
