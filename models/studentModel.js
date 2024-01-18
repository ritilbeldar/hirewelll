const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentModel = new mongoose.Schema(
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
      // select: false,
      // match: []
    },
    gender: { type: String, enum: ["Male", "Female", "Others"] },
    city: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    whatsappNumber: {
      type: String,
    },
    hirewellSource: {
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
    schoolType: {
      type: String,
    },
    role: {
      type: String,
    },
    isCurrentlyWorking: {
      type: String,
    },
    organizationName: {
      type: String,
    },

    relevantExperience: {
      type: String,
    },

    skills: {
      type: [String],
      max: 5,
    },
    qualificationLevel: {
      type: String,
    },
    preferredLocations: {
      type: [String],
    },
    languagesKnown: {
      type: [String],
    },
    teacherresume: {
      type: Object,
      url: String,
      fileId: "",
    },
    certifications: {
      type: Object,
      url: String,
      fileId: "",
    },
    resetPasswordToken: {
      type: String,
      default: "0",
    },

    currentctc: {
      type: String,
    },
    expectedctc: {
      type: String,
    },
    noticePeriod: {
      type: String,
    },
    remark: {
      type: String,
    },
    status: {
      type: String,
      default: "Active",
    },
    openings: [{ type: mongoose.Schema.Types.ObjectId, ref: "openings" }],
    training: [{ type: mongoose.Schema.Types.ObjectId, ref: "trainingevent" }],
  },
  { timestamps: true }
);

studentModel.pre("save", function () {
  if (!this.isModified("password")) {
    return;
  }
  let salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt);
});

studentModel.methods.comparepassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

studentModel.methods.getjwttoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Student = mongoose.model("student", studentModel);

module.exports = Student;
