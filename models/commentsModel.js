const mongoose = require("mongoose");

const CommentModel = new mongoose.Schema(
    {
      fullname: {
        type: String,
      },
      email: {
        type: String,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please fill a valid email address",
        ],
      },
      comment: {
        type: String,
      },
      Blog: [{ type: mongoose.Schema.Types.ObjectId, ref: "blog" }],
    },
    { timestamps: true }
  );

const Comments = mongoose.model("comment", CommentModel);

module.exports = Comments;
