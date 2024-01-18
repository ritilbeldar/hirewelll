const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const { adminisAuthenticated } = require("../middlewares/adminauth");
const Openings = require("../models/openingsModel");
const Student = require("../models/studentModel");
const path = require("path");
const imagekit = require("../utils/imagekit").initImageKit();

// *************************************** login singin logout route *************************

exports.createopenings = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  res.render("Admin/createOpenings", { currentPath, messages: req.flash() });
});

// post
exports.addopenings = catchAsyncErrors(async (req, res, next) => {
  const openings = new Openings(req.body);
  if (req.files.opnlogo) {
    const opnlogofile = req.files.opnlogo;
    const modifiedFileName = `opnlogo-${Date.now()}${path.extname(
      opnlogofile.name
    )}`;

    if (openings.opnlogo && openings.opnlogo.fileId !== "") {
      await imagekit.deleteFile(openings.opnlogo.fileId);
    }

    const { fileId, url } = await imagekit.upload({
      file: opnlogofile.data,
      fileName: modifiedFileName,
    });

    openings.opnlogo = { fileId, url };
  }
  Object.assign(openings, req.body);
  await openings.save();
  req.flash("success", "Opening Add Successfully");
  res.redirect("/admin/dashboard/openings/current-openings");
});

exports.currentopenings = catchAsyncErrors(async (req, res, next) => {
  const openings = await Openings.find();
  const students = await Student.find();

  const studentId = req.params.id;
  const student = await Student.findById(studentId);

  const currentPath = req.path;
  res.render("Admin/currentOpenings", {
    currentPath,
    openings,
    students,
    student,
    messages: req.flash(),
  });
});

exports.createopeningsdetails = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const openingId = req.params.id;
  const opening = await Openings.findById(openingId);

  if (!opening) {
    req.flash("error", "Opening not found");
  }
  res.render("Admin/createOpeningsView", {
    currentPath,
    opening,
    messages: req.flash(),
  });
});

exports.openingDelete = catchAsyncErrors(async (req, res, next) => {
  const openingId = req.params.id;

  try {
    const deletedOpening = await Openings.findByIdAndDelete(openingId);
    req.flash("success", "Opening Delete Successfully");
    return res.redirect("/admin/dashboard/openings/current-openings");
  } catch (error) {
    req.flash("error", "Something Want Wornge");
    return res.redirect("/admin/dashboard/openings/current-openings");
  }
});

exports.openingEdit = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const openingId = req.params.id;
  const opening = await Openings.findById(openingId);

  if (!opening) {
    req.flash("error", "opening not found");
  }
  res.render("Admin/editOpenings", {
    opening,
    currentPath,
    messages: req.flash(),
  });
});

exports.openingupdate = catchAsyncErrors(async (req, res, next) => {
  await Openings.findByIdAndUpdate(req.params.id, req.body).exec();
  req.flash("success", "Opening Update Successfully");
  res.redirect("/admin/dashboard/openings/current-openings");
});

exports.createopeningsView = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const opening = req.params.id;
  res.render("Admin/createOpeningsView", { currentPath, opening });
});

exports.openingsStatus = catchAsyncErrors(async (req, res, next) => {
  const openingId = req.body.openingId;

  try {
    const opening = await Openings.findOne({ _id: openingId });

    if (!opening) {
      req.flash("error", "Opening not found");
    }

    opening.status = opening.status === "Active" ? "Inactive" : "Active";
    await opening.save();
    req.flash("success", "Opening Status Update Successfully");
    res.redirect("/admin/dashboard/openings/current-openings");
  } catch (error) {
    req.flash("error", "Opening not found");
    res.redirect("/admin/dashboard/openings/current-openings");
  }
});


exports.openingsuserdetails = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();

  const currentPath = req.path;
  const openingId = req.params.id;
  const opening = await Openings.findById(openingId);

  if (!opening) {
    req.flash("error", "Opening not found");
  }
  res.render("Admin/openings_user_list", {
    currentPath,
    opening,
    messages: req.flash(),
    students
  });
});

exports.openings_user_list = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  console.log(students);
  const opening = await Openings.findById(req.params.id);

  if (!opening) {
    req.flash("error", "Opening not found");
   }

   res.render("Admin/openings_user_list", {  currentPath, opening,students, messages: req.flash() });
});


// *************************************** login singin logout route *************************
