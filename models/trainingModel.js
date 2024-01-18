const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const trainingModel = new mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    contact: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      select: false,
      // match: []
    },
    resetPasswordToken: {
      type: String,
      default: "0",
    },
    schoolName: {
      type: String,
    },
    schoolType: {
      type: String,
    },
    schoolemail: {
      type: String,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    schoolcontact: {
      type: String,
    },
    designation: {
      type: String,
    },
    schoolWebsite: {
      type: String,
    },
    trainingProgram: {
      type: String,
    },
    otherProgram: {
      type: String,
    },
    numberOfTeachers: {
      type: String,
    },
    dateForTraining: {
      type: String,
    },

    address: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    pincode: {
      type: String,
    },
    remark: {
      type: String,
    },
    status: {
      type: String,
      default: "Active",
    },
  },
  { timestamps: true }
);

trainingModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

trainingModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

trainingModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Training = mongoose.model("training", trainingModel);

module.exports = Training;
