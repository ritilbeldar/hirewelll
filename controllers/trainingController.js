const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const { isAuthenticated } = require("../middlewares/auth");

const Training = require("../models/trainingModel");
const Internship = require("../models/internshipModel");
const Job = require("../models/jobModel");
const ErorrHandler = require("../utils/ErrorHandler");
const { sendtoken } = require("../utils/SendToken");
const { sendmail } = require("../utils/nodemailer");
const path = require("path");
const imagekit = require("../utils/imagekit").initImageKit();

exports.homepage = catchAsyncErrors(async (req, res, next) => {
  res.render("Frontend/index", { isAuthenticated: false });
});

exports.currenttraining = catchAsyncErrors(async (req, res, next) => {
  const training = await Training.findById(req.id)
    // .populate("jobs")
    // .populate("internships")
    .exec();
  res.render("Frontend/index", { isAuthenticated });
});

exports.trainingsignup = catchAsyncErrors(async (req, res, next) => {
  const training = await new Training(req.body).save();
  res.redirect("/");
});

exports.employesignin = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({ email: req.body.email })
    .select("+password")
    .exec();

  if (!employe)
    return next(
      new ErorrHandler("User not found with this email address", 404)
    );
  const isMatch = employe.comparepassword(req.body.password);
  if (!isMatch) return next(new ErorrHandler("Wrong Credientials", 500));

  sendtoken(employe, 200, res);
});

exports.employesignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  res.json({ message: "Successfully signout!" });
});

exports.employesendmail = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findOne({
    email: req.body.email,
  }).exec();

  if (!employe)
    return next(
      new ErorrHandler("User not found with this email address", 404)
    );

  const url = `${req.protocol}://${req.get("host")}/employe/forget-link/${
    employe._id
  }`;
  sendmail(req, res, next, url);
  employe.resetPasswordToken = "1";
  await employe.save();
  res.json({ employe, url });
});

exports.employeforgetlink = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.params.id).exec();

  if (!employe)
    return next(
      new ErorrHandler("User not found with this email address", 404)
    );

  if (employe.resetPasswordToken == "1") {
    employe.resetPasswordToken = "0";
    employe.password = req.body.password;
    await employe.save();
  } else {
    return next(
      new ErorrHandler("Invalid Reset Password Link! Please try again", 500)
    );
  }
  res.status(200).json({
    message: "Password has been successfully Changed",
  });
});

exports.employeresetpassword = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  employe.password = req.body.password;
  await employe.save();
  sendtoken(employe, 201, res);
});

exports.employeupdate = catchAsyncErrors(async (req, res, next) => {
  await Employe.findByIdAndUpdate(req.params.id, req.body).exec();
  res.status(200).json({
    success: true,
    message: "employe Updated Successfully!",
  });
});

exports.employeresume = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.params.id).exec();
  const file = req.files.organizationlogo;
  const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
    file.name
  )}`;

  if (employe.organizationlogo.fileId !== "") {
    await imagekit.deleteFile(employe.organizationlogo.fileId);
  }

  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });
  employe.organizationlogo = { fileId, url };
  await employe.save();
  res.status(200).json({
    success: true,
    message: "Profile updated!",
  });
});

// -------------- Internship --------
exports.createinternship = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  const internship = await new Internship(req.body);
  internship.employe = employe._id;
  employe.internships.push(internship._id);
  await internship.save();
  await employe.save();
  res.status(201).json({ success: true, internship });
});

exports.readinternship = catchAsyncErrors(async (req, res, next) => {
  const { internships } = await Employe.findById(req.id)
    .populate("internships")
    .exec();
  res.status(200).json({ success: true, internships });
});

exports.readsingleinternship = catchAsyncErrors(async (req, res, next) => {
  const internship = await await Internship.findById(req.params.id).exec();
  res.status(200).json({ success: true, internship });
});

// -------------- Jobs --------
exports.createjob = catchAsyncErrors(async (req, res, next) => {
  const employe = await Employe.findById(req.id).exec();
  const job = await new Job(req.body);
  job.employe = employe._id;
  employe.jobs.push(job._id);
  await employe.save();
  await job.save();
  res.status(201).json({ success: true, job });
});

exports.readjob = catchAsyncErrors(async (req, res, next) => {
  const { jobs } = await Employe.findById(req.id).populate("jobs").exec();
  res.status(200).json({ success: true, jobs });
});

exports.readsinglejob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id).exec();
  res.status(200).json({ success: true, job });
});
