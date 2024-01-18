const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const { isAuthenticated } = require("../middlewares/auth");
const Student = require("../models/studentModel");
const Openings = require("../models/openingsModel");
const ContactUs = require("../models/contactUsModel");
const Internship = require("../models/internshipModel");
const Job = require("../models/jobModel");
const Blogs = require("../models/blogModel");
const Comments = require("../models/commentsModel");
const TrainingEvents = require("../models/trainingEventsModel");
const Address = require("../models/addressModel");

const ErorrHandler = require("../utils/ErrorHandler");
const nodemailer = require("nodemailer");
const { sendtoken } = require("../utils/SendToken");
const { sendmail } = require("../utils/nodemailer");
const path = require("path");
const imagekit = require("../utils/imagekit").initImageKit();

exports.notfound = catchAsyncErrors(async (req, res, next) => {
  res.render("404", { title: "Page Not Found" });
});

exports.homepage = catchAsyncErrors(async (req, res, next) => {
  try {
    const students = await Student.find();
    const openings = await Openings.find();
    const blogs = await Blogs.find();
    const trainingEvents = await TrainingEvents.find();

    const addresses = await Address.find();
    const uniqueStates = Array.from(new Set(addresses.map(address => address.state)));

    res.render("Frontend/index", {
      messages: req.flash(),
      students,
      openings,
      isAuthenticated: false,
      title: "Home",
      blogs,
      trainingEvents,
      uniqueStates,
      addresses,
    });
  } catch (error) {
    req.flash("error", "Oops! Something went wrong.");
    res.redirect("/");
  }
});

exports.aboutUs = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/aboutUs", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "About Us",
  });
});
exports.tecaboutUs = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/aboutUs", {
    messages: req.flash(),
    students,
    isAuthenticated: true,
    title: "About Us",
  });
});

exports.preSchoolSetups = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/preSchoolSetups", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Pre School Setups",
  });
});
exports.tecpreSchoolSetups = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/preSchoolSetups", {
    messages: req.flash(),
    students,
    isAuthenticated: true,
    title: "Pre School Setups",
  });
});
exports.recruitment = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/recruitment", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Recruitment",
  });
});
exports.tecrecruitment = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/recruitment", {
    messages: req.flash(),
    students,
    isAuthenticated: true,
    title: "Recruitment",
  });
});

exports.blogDetails = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  const blogsId = req.params.id;
  const blogss = await Blogs.find();

  try {
    const blogs = await Blogs.findById(blogsId).populate("Comments").exec();

    res.render("Frontend/blogDetails", {
      messages: req.flash(),
      students,
      isAuthenticated: false,
      title: "Blog Details",
      blogs,
      comments: blogs.Comments,
      blogss,
    });
  } catch (error) {
    next(error);
  }
});

exports.blogGrid = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  const blogs = await Blogs.find();
  res.render("Frontend/blogGrid", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Blogs",
    blogs,
  });
});

exports.tecblogDetails = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  const blogsId = req.params.id;
  const blogss = await Blogs.find();

  try {
    const blogs = await Blogs.findById(blogsId).populate("Comments").exec();

    res.render("Frontend/blogDetails", {
      messages: req.flash(),
      students,
      isAuthenticated: true,
      title: "Blog Details",
      blogs,
      comments: blogs.Comments,
      blogss,
    });
  } catch (error) {
    next(error);
  }
});

exports.tecblogGrid = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  const blogs = await Blogs.find();
  res.render("Frontend/blogGrid", {
    messages: req.flash(),
    students,
    isAuthenticated: true,
    title: "Blogs",
    blogs,
  });
});

exports.contactUs = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/contactUs", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Contact Us",
  });
});

exports.teccontactUs = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/contactUs", {
    messages: req.flash(),
    students,
    isAuthenticated: true,
    title: "Contact Us",
  });
});
exports.contactUsdata = catchAsyncErrors(async (req, res, next) => {
  const contactUs = new ContactUs(req.body);
  await contactUs.save();
  sendmail(req, res, next);
  req.flash("success", "Thank You For Contact Us");
});

exports.events = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  const trainingEvents = await TrainingEvents.find();
  res.render("Frontend/events", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Events",
    trainingEvents,
  });
});

exports.founders = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/founders", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Founders",
  });
});
exports.jobDescription = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/jobDescription", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Job Description",
  });
});
exports.jollyPhonics = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/jollyPhonics", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Jolly Phonics",
  });
});

exports.openings = catchAsyncErrors(async (req, res, next) => {
  const openings = await Openings.find();
  const students = await Student.find();
  res.render("Frontend/openings", {
    messages: req.flash(),
    students,
    openings,
    isAuthenticated: false,
    title: "Openings",
  });
});

exports.tecopenings = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).populate("openings").exec();
  const openings = await Openings.find();

  const appliedOpeningsIds = student.openings.map((opening) =>
    opening._id.toString()
  );

  res.render("Frontend/openings", {
    messages: req.flash(),
    student,
    openings,
    appliedOpeningsIds,
    isAuthenticated: true,
    title: "Training Topics",
  });
});

exports.tecevents = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).populate("training").exec();
  const trainingEvents = await TrainingEvents.find();

  const appliedTrainingIds = student.training.map((event) =>
    event._id.toString()
  );

  res.render("Frontend/events", {
    messages: req.flash(),
    student,
    isAuthenticated: true,
    title: "Events",
    trainingEvents,
    appliedTrainingIds,
  });
});

exports.training = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/training", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Training",
  });
});

exports.tectraining = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/training", {
    messages: req.flash(),
    students,
    isAuthenticated: true,
    title: "Training",
  });
});

exports.jobDescriptiondetails = catchAsyncErrors(async (req, res, next) => {
  const openingId = req.params.id;
  const opening = await Openings.findById(openingId);

  if (!opening) {
    return res.status(404).send("Opening not found");
  }
  res.render("Frontend/jobDescription", {
    messages: req.flash(),
    opening,
    title: "Job Description",
    isAuthenticated: false,
  });
});

exports.trainingsEventsDetails = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  const eventId = req.params.id;
  const events = await TrainingEvents.find();

  console.log(events);

  try {
    const event = await TrainingEvents.findById(eventId);

    res.render("Frontend/trainingsEventsDetails", {
      messages: req.flash(),
      students,
      isAuthenticated: false,
      title: "Trainings Events Details",
      event,
      events,
    });
  } catch (error) {
    next(error);
  }
});

exports.jobDescription = catchAsyncErrors(async (req, res, next) => {
  const opening = req.params.id;
  const students = await Student.find();
  res.render("Frontend/jobDescription", {
    messages: req.flash(),
    opening,
    students,
    isAuthenticated: false,
    title: "Job Description",
  });
});

exports.tecjobDescription = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).populate("openings").exec();
  const openings = await Openings.find();
  const appliedOpeningsIds = student.openings.map((opening) =>
    opening._id.toString()
  );

  const openingId = req.params.id;
  const opening = await Openings.findById(openingId);

  if (!opening) {
    return res.status(404).send("Opening not found");
  }
  res.render("Frontend/jobDescription", {
    messages: req.flash(),
    openings,
    student,
    appliedOpeningsIds,
    opening,
    title: "Job Description",
    isAuthenticated: true,
  });
});

exports.tectrainingsEventsDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const student = await Student.findById(req.id).populate("training").exec();
    const events = await TrainingEvents.find();

    // Check if student and student.training are defined
    const appliedOpeningsIds =
      student && student.training
        ? student.training.map((event) => event._id.toString())
        : [];

    const eventId = req.params.id;
    const event = await TrainingEvents.findById(eventId);

    res.render("Frontend/trainingsEventsDetails", {
      messages: req.flash(),
      student,
      isAuthenticated: true,
      title: "Trainings Events Details",
      event,
      events,
      appliedOpeningsIds,
    });
  } catch (error) {
    next(error);
  }
});

exports.solutions = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/solutions", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Solutions",
  });
});
exports.trainingTopics = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/trainingTopics", {
    messages: req.flash(),
    students,
    isAuthenticated: false,
    title: "Training Topics",
  });
});

exports.tecfounders = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/founders", {
    messages: req.flash(),
    students,
    isAuthenticated: true,
    title: "Founders",
  });
});

exports.tecjollyPhonics = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/jollyPhonics", {
    messages: req.flash(),
    students,
    isAuthenticated: true,
    title: "Jolly Phonics",
  });
});

exports.tecsolutions = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/solutions", {
    messages: req.flash(),
    students,
    isAuthenticated: true,
    title: "Solutions",
  });
});
exports.tectrainingTopics = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  res.render("Frontend/trainingTopics", {
    messages: req.flash(),
    students,
    isAuthenticated: true,
    title: "Training Topics",
  });
});

exports.currentuser = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id);
  const openings = await Openings.find();
  const blogs = await Blogs.find();

  const trainingEvents = await TrainingEvents.find();

  const appliedOpeningsIds = student.openings.map((opening) =>
    opening._id.toString()
  );

  const appliedTrainingIds = student.training.map((event) =>
    event._id.toString()
  );

  res.render("Frontend/index", {
    messages: req.flash(),
    student,
    openings,
    appliedOpeningsIds,
    isAuthenticated: true,
    title: "Home",
    blogs,
    trainingEvents,
    appliedTrainingIds,
  });
});

exports.studentsignup = catchAsyncErrors(async (req, res, next) => {
  try {
    const existingStudentEmail = await Student.findOne({
      email: req.body.email,
    });
    const existingStudentNumber = await Student.findOne({
      contact: req.body.contact,
    });

    if (existingStudentEmail) {
      req.flash("warning", "Email is already taken.");
      return res.redirect("/");
    }

    if (existingStudentNumber || req.body.contact.length !== 10) {
      req.flash(
        "warning",
        "Invalid phone number. Please provide a 10-digit phone number."
      );
      return res.redirect("/");
    }

    const student = new Student(req.body);

    if (req.files.teacherresume) {
      const teacherresumefile = req.files.teacherresume;
      const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
        teacherresumefile.name
      )}`;

      if (student.teacherresume && student.teacherresume.fileId !== "") {
        await imagekit.deleteFile(student.teacherresume.fileId);
      }

      const { fileId, url } = await imagekit.upload({
        file: teacherresumefile.data,
        fileName: modifiedFileName,
      });

      student.teacherresume = { fileId, url };
    }

    if (req.files.certifications) {
      const certificationsfile = req.files.certifications;
      const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
        certificationsfile.name
      )}`;

      if (student.certifications && student.certifications.fileId !== "") {
        await imagekit.deleteFile(student.certifications.fileId);
      }

      const { fileId, url } = await imagekit.upload({
        file: certificationsfile.data,
        fileName: modifiedFileName,
      });
      student.certifications = { fileId, url };
    }

    Object.assign(student, req.body);
    await student.save();

    req.flash("success", "Registration successful!");
    res.redirect("/");
  } catch (error) {
    console.error(error);
    req.flash("error", "Oops! Something went wrong.");
    res.redirect("/");
  }
});

exports.studentsignin = catchAsyncErrors(async (req, res, next) => {
  try {
    const student = await Student.findOne({ email: req.body.email })
      .select("+password")
      .exec();

    if (!student) {
      req.flash("warning", "User not found with this email address");
      return res.redirect("/");
    }

    if (student.status !== "Active") {
      req.flash("warning", "User not found with this email address");
      res.redirect("/");
    }

    const isMatch = student.comparepassword(req.body.password);

    if (!isMatch) {
      req.flash("warning", "Wrong Credentials");
      return res.redirect("/");
    }

    req.flash("success", "Teacher Login successful");
    sendtoken(student, 200, res);
  } catch (error) {
    req.flash("error", "Somthing Want Wonge");
    return res.redirect("/");
  }
});

exports.studentsignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("token");
  req.flash("success", "Teacher Logout successful");
  res.redirect("/");
});

exports.userdashboard = catchAsyncErrors(async (req, res, next) => {
  try {
    const { openings } = await Student.findById(req.id)
      .populate("openings")
      .exec();

    const { training } = await Student.findById(req.id)
      .populate("training")
      .exec();

    const student = await Student.findById(req.id);

    res.render("Frontend/userDashboard", {
      messages: req.flash(),
      student,
      openings,
      training,
      isAuthenticated: true,
      title: "Dashboard",
    });
  } catch (error) {
    console.error("Error fetching student by ID:", error);
  }
});

// ------------Comments------------------

exports.blogComments = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email } = req.body;
    const blogId = req.params.id;

    const existingComment = await Comments.findOne({
      email,
      Blog: blogId,
    }).exec();
    if (existingComment) {
      req.flash("error", "You have already commented on this blog.");
      return res.redirect(req.get("referer"));
    }

    const comments = new Comments(req.body);

    const blog = await Blogs.findById(blogId).exec();
    comments.Blog.push(blog._id);
    blog.Comments.push(comments._id);

    await comments.save();
    await blog.save();

    req.flash("success", "Comment Added Successfully");
  } catch (error) {
    req.flash("error", "You have already commented on this blog.");
  }
  res.redirect(req.get("referer"));
});

// ------------Comments------------------

// ------apply job ----

exports.applyjob = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const opening = await Openings.findById(req.params.id).exec();

  // Update student and opening data
  student.openings.push(opening._id);
  opening.students.push(student._id);
  await student.save();
  await opening.save();

  req.flash("success", "Applied Successfully");

  // Send email to the student
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Hirewell Pvt <ritikbeldar011@gmail.com>",
    to: student.email, // Use the student's email address
    subject: "Application Successful",
    text: `Dear ${student.firstname},\n\nThank you for applying for the job "${opening.opnTitle}". We have received your application and will get back to you as soon as possible.\n\nBest regards,\nHireWell`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return next(new ErorrHandler(err, 500));
    console.log(info);
    res.redirect("/teacher/dashboard");
  });
});

exports.removejob = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const opening = await Openings.findById(req.params.id).exec();

  // Remove references from student and opening data
  const studentIndex = student.openings.indexOf(opening._id);
  if (studentIndex !== -1) {
    student.openings.splice(studentIndex, 1);
  }

  const openingIndex = opening.students.indexOf(student._id);
  if (openingIndex !== -1) {
    opening.students.splice(openingIndex, 1);
  }

  // Send email to the student
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Hirewell Pvt <ritikbeldar011@gmail.com>",
    to: student.email,
    subject: "Job Application Removed",
    text: `Dear ${student.firstname},\n\nYour application for the job "${opening.opnTitle}" has been removed. If you have any questions, feel free to contact us.\n\nBest regards,\nHireWell`,
  };

  await student.save();
  await opening.save();

  req.flash("warning", "Removed Successfully");

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return next(new ErorrHandler(err, 500));
    console.log(info);
    res.redirect("/teacher/dashboard");
  });
});

// ------apply job ----

// ------apply events ----
exports.applyevent = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const events = await TrainingEvents.findById(req.params.id).exec();

  // Update student and opening data
  student.training.push(events._id);
  events.students.push(student._id);
  await student.save();
  await events.save();

  req.flash("success", "Training Applied Successfully");

  // Send email to the student
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Hirewell Pvt <ritikbeldar011@gmail.com>",
    to: student.email,
    subject: "Training Application Successful",
    text: `Dear ${student.firstname},\n\nThank you for applying for the training "${events.trainingHeading}". We have received your application and will get back to you as soon as possible.\n\nBest regards,\nHireWell`,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return next(new ErorrHandler(err, 500));
    console.log(info);
    res.redirect("/teacher/dashboard");
  });
});

exports.removeevent = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const events = await TrainingEvents.findById(req.params.id).exec();

  // Remove references from student and events data
  const studentIndex = student.training.indexOf(events._id);
  if (studentIndex !== -1) {
    student.training.splice(studentIndex, 1);
  }

  const openingIndex = events.students.indexOf(student._id);
  if (openingIndex !== -1) {
    events.students.splice(openingIndex, 1);
  }

  // Send email to the student
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Hirewell Pvt <ritikbeldar011@gmail.com>",
    to: student.email,
    subject: "Training Application Removed",
    text: `Dear ${student.firstname},\n\nYour application for the Training "${events.trainingHeading}" has been removed. If you have any questions, feel free to contact us.\n\nBest regards,\nHireWell`,
  };

  await student.save();
  await events.save();

  req.flash("warning", "Removed Successfully");

  transport.sendMail(mailOptions, (err, info) => {
    if (err) return next(new ErrorHandler(err, 500));
    console.log(info);
    res.redirect("/teacher/dashboard");
  });
});

// ------apply events ----

exports.studentsendmail = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findOne({ email: req.body.email }).exec();

  if (!student)
    return next(
      new ErorrHandler("User not found with this email address", 404)
    );

  const url = `${req.protocol}://${req.get("host")}/teacher/forget-link/${
    student._id
  }`;
  sendmail(req, res, next, url);
  student.resetPasswordToken = "1";
  await student.save();
  res.json({ student, url });
});

exports.studentforgetlink = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();

  if (!student)
    return next(
      new ErorrHandler("User not found with this email address", 404)
    );

  if (student.resetPasswordToken == "1") {
    student.resetPasswordToken = "0";
    student.password = req.body.password;
    await student.save();
  } else {
    return next(
      new ErorrHandler("Invalid Reset Password Link! Please try again", 500)
    );
  }
  res.status(200).json({
    message: "Password has been successfully Changed",
  });
});

exports.studentresetpassword = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  student.password = req.body.password;
  await student.save();
  sendtoken(student, 201, res);
});

exports.studentupdate = catchAsyncErrors(async (req, res, next) => {
  await Student.findByIdAndUpdate(req.params.id, req.body).exec();
  res.status(200).json({
    success: true,
    message: "Student Updated Successfully!",
  });
});

exports.studentavatar = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();
  const file = req.files.avatar;
  const modifiedFileName = `resumebuilder-${Date.now()}${path.extname(
    file.name
  )}`;

  if (student.avatar.fileId !== "") {
    await imagekit.deleteFile(student.avatar.fileId);
  }

  const { fileId, url } = await imagekit.upload({
    file: file.data,
    fileName: modifiedFileName,
  });
  student.avatar = { fileId, url };
  await student.save();
  res.status(200).json({
    success: true,
    message: "Profile updated!",
  });
});

// ------apply internship ----
exports.applyinternship = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.id).exec();
  const internship = await Internship.findById(req.params.internshipid).exec();

  student.internships.push(internship._id);
  internship.students.push(student._id);
  await student.save();
  await internship.save();

  res.json({ student, internship });
});

// -----------------------read all jobs---------------

exports.readalljobs = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find().exec();

  res.status(200).json({ jobs });
});

// -------------------read all internships ----
exports.readallinternships = catchAsyncErrors(async (req, res, next) => {
  const internships = await Internship.find().exec();

  res.status(200).json({ internships });
});
