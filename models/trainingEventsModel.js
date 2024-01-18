const mongoose = require("mongoose");

const TrainingEventsModel = new mongoose.Schema(
  {
    trainingBanner: {
      type: Object,
      default: {
        fileId: "",
        url: "",
      },
    },
    trainingProfile: {
      type: Object,
      default: {
        fileId: "",
        url: "http://localhost:8080/Frontend/newimg/logo.png",
      },
    },
    trainingBy: String,
    trainingLocation: String,
    trainingProgram: String,
    otherTraining: String,
    trainingStartDate: { type: Date },
    trainingEndDate: { type: Date },
    trainingHeading: String,
    trainingDescription1: String,
    trainingTitle: String,
    trainingPoints: {
      type: [String],
    },
    trainingDescription2: String,
    trainingTags: String,
    status: {
      type: String,
      default: "Active",
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "student" }],
  },
  { timestamps: true }
);

const TrainingEvents = mongoose.model("trainingevent", TrainingEventsModel);

module.exports = TrainingEvents;
