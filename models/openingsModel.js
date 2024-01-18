const mongoose = require("mongoose");

const openingsModel = new mongoose.Schema(
  {
    opnlogo: {
      type: Object,
      default: {
        fileId: "",
        url: "https://st4.depositphotos.com/14953852/24787/v/450/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg",
      },
    },
    opnTitle: String,
    opnPreference: String,
    opnCompney: String,
    opnLnocation: String,
    opnLastDate: { type: Date },
    opnExp: String,
    opnType: String,
    opnMinPrice: Number,
    opnMaxPrice: Number,
    opnPriceType: String,
    opnTotalOpenings: Number,
    opnDescription: String,
    opnGender: String,
    opmRequirements: {
      type: [String],
    },
    opmResponsibilities: {
      type: [String],
    },
    opnQualification: String,
    status: {
      type: String,
      default: "Active",
    },

    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],
  },
  { timestamps: true }
);

const Openings = mongoose.model("openings", openingsModel);

module.exports = Openings;
