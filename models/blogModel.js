const mongoose = require("mongoose");

const blogModel = new mongoose.Schema(
    {
      blogimg: {
        type: Object,
        default: {
          fileId: "",
          url: "",
        },
      },
      blogProfile: {
        type: Object,
        default: {
          fileId: "",
          url: "http://localhost:8080/Frontend/newimg/logo.png",
        },
      },
      blogBy: String,
      blogHeading: String,
      blogDescription1: String,
      blogTitle: String,
      blogPoints: {
        type: [String],
      },
      blogDescription2: String,
      blogTags:String,
      status: {
        type: String,
        default: "Active",
      },
      Comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    },
    { timestamps: true }
  );

const Blogs = mongoose.model("blog", blogModel);

module.exports = Blogs;
