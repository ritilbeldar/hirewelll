const mongoose = require("mongoose");

const contactUsModel = new mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    contact: {
      type: String,
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    massage: {
      type: String,
    },
  },
  { timestamps: true }
);

const ContactUs = mongoose.model("contactus", contactUsModel );

module.exports = ContactUs;
