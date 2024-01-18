const { catchAsyncErrors } = require("../middlewares/catchAsyncErrors");
const { adminisAuthenticated } = require("../middlewares/adminauth");
const Trainings = require("../models/trainingModel");
const Schools = require("../models/employeModel");
const ContactUs = require("../models/contactUsModel");
const Student = require("../models/studentModel");
const Admin = require("../models/adminModel");
const Blogs = require("../models/blogModel");
const Comments = require("../models/commentsModel");
const TrainingEvents = require("../models/trainingEventsModel");
const Address = require("../models/addressModel");

const ErorrHandler = require("../utils/ErrorHandler");
const { AdminSendToken } = require("../utils/AdminSendToken");
const path = require("path");
const imagekit = require("../utils/imagekit").initImageKit();

// *************************************** login singin logout route *************************

exports.adminsignup = catchAsyncErrors(async (req, res, next) => {
  const existingAdmin = await Admin.findOne({ username: req.body.username });
  if (existingAdmin) {
    req.flash("warning", "Admin is Already Registered");
    return res.redirect("/admin/login");
  }
  const admin = await new Admin(req.body).save();
  req.flash("success", "Admin is Created Successfully");
  AdminSendToken(admin, 201, res);
});

exports.adminsignin = catchAsyncErrors(async (req, res, next) => {
  const admin = await Admin.findOne({ username: req.body.username })
    .select("+password")
    .exec();

  if (!admin) {
    req.flash("warning", "Username not found!");
    return res.redirect("/admin/login");
  }

  const isMatch = admin.comparepassword(req.body.password);

  if (!isMatch) {
    req.flash("warning", "Wrong Credientials");
    return res.redirect("/admin/login");
  }

  req.flash("success", "Admin is Login Successfully");
  AdminSendToken(admin, 200, res);
});

exports.adminsignout = catchAsyncErrors(async (req, res, next) => {
  res.clearCookie("admintoken");
  req.flash("warning", "Admin Logout Successfully");
  res.redirect("/admin/login");
});

exports.login = catchAsyncErrors(async (req, res, next) => {
  res.render("Admin/login", {
    adminisAuthenticated: false,
    messages: req.flash(),
  });
});

// *************************************** login singin logout route *************************

exports.dashboard = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  const schools = await Schools.find();
  const trainings = await Trainings.find();
  const enquires = await ContactUs.find();
  const currentPath = req.path;
  res.render("Admin/Dashboard", {
    messages: req.flash(),
    currentPath,
    students,
    schools,
    trainings,
    enquires,
  });
});

// *************************************** teacher all route *************************

exports.teacher = catchAsyncErrors(async (req, res, next) => {
  const { openings } = await Student.findById(req.id)
    .populate("openings")
    .exec();
  const { training } = await Student.findById(req.id)
    .populate("training")
    .exec();

  const currentPath = req.path;
  const students = await Student.find();
  res.render("Admin/teacher", {
    openings,
    training,
    students,
    currentPath,
    messages: req.flash(),
  });
});

exports.teacherDetails = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      req.flash("warning", "Teacher not found");
      return res.redirect("admin/teachers");
    }

    const { openings, training } = await Student.findById(studentId)
      .populate("openings")
      .populate("training")
      .exec();

    res.render("Admin/teacher_view", {
      student,
      currentPath,
      openings,
      training,
      messages: req.flash(),
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    req.flash("error", "An error occurred while fetching teacher details.");
    res.redirect("admin/teachers");
  }
});

exports.teacher_view = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const student = req.params.id;
  res.render("Admin/teacher_view", {
    student,
    currentPath,
    messages: req.flash(),
  });
});

exports.teacherEdit = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const studentId = req.params.id;
  const student = await Student.findById(studentId);

  if (!student) {
    req.flash("warning", "Teacher not found");
    res.redirect("admin/teachers");
  }
  res.render("Admin/teacher_edit", {
    student,
    currentPath,
    messages: req.flash(),
  });
});

exports.teacherDelete = catchAsyncErrors(async (req, res, next) => {
  const studentId = req.params.id;

  try {
    // Find the student by ID to get the associated files
    const student = await Student.findById(studentId);

    // Delete resume file if it exists
    if (student.teacherresume && student.teacherresume.fileId !== "") {
      await imagekit.deleteFile(student.teacherresume.fileId);
    }

    // Delete certifications file if it exists
    if (student.certifications && student.certifications.fileId !== "") {
      await imagekit.deleteFile(student.certifications.fileId);
    }

    // Delete the student
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    req.flash("success", "Teacher Delete Successfully");
    res.redirect("/admin/teachers");
  } catch (error) {
    console.error(error);
    req.flash("error", "Something Went Wrong");
    res.redirect("/admin/teachers");
  }
});

exports.teacherupdate = catchAsyncErrors(async (req, res, next) => {
  await Student.findByIdAndUpdate(req.params.id, req.body).exec();
  req.flash("success", "Teacher Update Successfully");
  res.redirect("/admin/teachers");
});

exports.teacherresumeupdate = catchAsyncErrors(async (req, res, next) => {
  const student = await Student.findById(req.params.id).exec();

  if (!student) {
    return res.redirect("/admin/teachers");
  }

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
    const modifiedCertFileName = `resumebuilder-${Date.now()}${path.extname(
      certificationsfile.name
    )}`;

    if (student.certifications && student.certifications.fileId !== "") {
      await imagekit.deleteFile(student.certifications.fileId);
    }

    const { fileId, url } = await imagekit.upload({
      file: certificationsfile.data,
      fileName: modifiedCertFileName,
    });
    student.certifications = { fileId, url };
  }
  await student.save();
  req.flash("success", "Teacher Update Successfully");
  res.redirect("/admin/teachers");
});

exports.addteacher = catchAsyncErrors(async (req, res, next) => {
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
  req.flash("success", "Teacher Add Successfully");
  res.redirect("/admin/teachers");
});

exports.teacher_add = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;

  res.render("Admin/teacher_add", {
    currentPath,
    adminisAuthenticated: true,
    messages: req.flash(),
  });
});

exports.teacherStatus = catchAsyncErrors(async (req, res, next) => {
  const studentId = req.body.student;
  try {
    const student = await Student.findOne({ _id: studentId });

    if (!student) {
      req.flash("warning", "Teacher not found");
      res.redirect("/admin/teachers");
    }

    student.status = student.status === "Active" ? "Inactive" : "Active";
    await student.save();
    req.flash("success", "Teacher Status Update Successfully");
    res.redirect("/admin/teachers");
  } catch (error) {
    req.flash("error", "Internal Server Error");
    res.redirect("/admin/teachers");
  }
});

// *************************************** teacher all route *************************

// *************************************** school all route *************************

exports.school = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const schools = await Schools.find();
  res.render("Admin/schools", { schools, currentPath, messages: req.flash() });
});

exports.schoolDetails = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;

  const schoolId = req.params.id;
  const school = await Schools.findById(schoolId);

  if (!school) {
    req.flash("warning", "School not found");
    res.redirect("/admin/schools");
  }
  res.render("Admin/school_view", {
    school,
    currentPath,
    messages: req.flash(),
  });
});

exports.school_view = catchAsyncErrors(async (req, res, next) => {
  const school = req.params.id;
  res.render("Admin/admin/school_view", { school });
});

exports.schoolDelete = catchAsyncErrors(async (req, res, next) => {
  const schoolId = req.params.id;
  try {
    const deletedSchool = await Schools.findByIdAndDelete(schoolId);
    req.flash("success", "School Delete Successfully");
    return res.redirect("/admin/schools");
  } catch (error) {
    console.error("Error deleting student:", error);
    return res.status(500).send("Internal Server Error");
  }
});

exports.schoolEdit = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;

  const schoolId = req.params.id;
  const school = await Schools.findById(schoolId);

  if (!school) {
    req.flash("warning", "School not found");
    return res.redirect("/admin/schools");
  }
  res.render("Admin/school_edit", {
    school,
    currentPath,
    messages: req.flash(),
  });
});

exports.schoolupdate = catchAsyncErrors(async (req, res, next) => {
  await Schools.findByIdAndUpdate(req.params.id, req.body).exec();
  req.flash("success", "School Update Successfully");
  res.redirect("/admin/schools");
});

exports.addschool = catchAsyncErrors(async (req, res, next) => {
  const school = await new Schools(req.body).save();
  req.flash("success", "School Add Successfully");
  res.redirect("/admin/schools");
});

exports.school_add = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  res.render("Admin/school_add", {
    currentPath,
    isAuthenticated: true,
    messages: req.flash(),
  });
});

exports.schoolStatus = catchAsyncErrors(async (req, res, next) => {
  const schoolId = req.body.school;
  try {
    const school = await Schools.findOne({ _id: schoolId });

    if (!school) {
      req.flash("warning", "School not found");
      res.redirect("/admin/schools");
    }

    school.status = school.status === "Active" ? "Inactive" : "Active";
    await school.save();
    req.flash("success", "School Status Update Successfully");
    res.redirect("/admin/schools");
  } catch (error) {
    req.flash("error", "Internal Server Error");
    res.redirect("/admin/schools");
  }
});
// *************************************** school all route *************************

// *************************************** training all route *************************

exports.training = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const trainings = await Trainings.find();
  res.render("Admin/trainings", {
    trainings,
    currentPath,
    messages: req.flash(),
  });
});

exports.trainingStatus = catchAsyncErrors(async (req, res, next) => {
  const trainingId = req.body.training;
  try {
    const training = await Trainings.findOne({ _id: trainingId });

    if (!training) {
      req.flash("warning", "Training not found");
      res.redirect("/admin/trainings");
    }

    training.status = training.status === "Active" ? "Inactive" : "Active";
    await training.save();
    req.flash("success", "Training Status Update Successfully");
    res.redirect("/admin/trainings");
  } catch (error) {
    req.flash("error", "Internal Server Error");
    res.redirect("/admin/trainings");
  }
});

exports.trainingDetails = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;

  const trainingId = req.params.id;
  const training = await Trainings.findById(trainingId);

  if (!training) {
    req.flash("warning", "Training not found");
    res.redirect("/admin/trainings");
  }
  res.render("Admin/training_view", {
    training,
    currentPath,
    messages: req.flash(),
  });
});

exports.training_view = catchAsyncErrors(async (req, res, next) => {
  const training = req.params.id;
  res.render("Admin/training_view", { training });
});

exports.trainingDelete = catchAsyncErrors(async (req, res, next) => {
  const trainingId = req.params.id;

  try {
    const deletedtraining = await Trainings.findByIdAndDelete(trainingId);
    req.flash("success", "Training Delete Successfully");
    return res.redirect("/admin/trainings");
  } catch (error) {
    console.error("Error deleting student:", error);
    return res.status(500).send("Internal Server Error");
  }
});

exports.trainingEdit = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;

  const trainingId = req.params.id;
  const training = await Trainings.findById(trainingId);

  if (!training) {
    req.flash("warning", "Training not found");
    res.redirect("/admin/trainings");
  }
  res.render("Admin/training_edit", {
    training,
    currentPath,
    messages: req.flash(),
  });
});

exports.trainingupdate = catchAsyncErrors(async (req, res, next) => {
  await Trainings.findByIdAndUpdate(req.params.id, req.body).exec();
  req.flash("success", "Training Update Successfully");
  res.redirect("/admin/trainings");
});
exports.addtraining = catchAsyncErrors(async (req, res, next) => {
  const existingStudentEmail = await Trainings.findOne({
    email: req.body.email,
  });
  const existingStudentNumber = await Trainings.findOne({
    contact: req.body.contact,
  });

  if (existingStudentEmail) {
    req.flash("warning", "Email is already taken.");
    return res.redirect("/admin/training_add");
  }

  if (req.body.contact.length !== 10) {
    req.flash(
      "warning",
      "Invalid phone number. Please provide a 10-digit phone number."
    );
    return res.redirect("/admin/training_add");
  }

  if (existingStudentNumber) {
    req.flash("warning", "Number is already taken.");
    return res.redirect("/admin/training_add");
  }

  const training = await new Trainings(req.body).save();
  req.flash("success", "Training Add Successfully");
  res.redirect("/admin/trainings");
});

exports.training_add = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  res.render("Admin/training_add", {
    currentPath,
    isAuthenticated: true,
    messages: req.flash(),
  });
});

// *************************************** training all route *************************

exports.enquire = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const enquires = await ContactUs.find();
  res.render("Admin/enquire", { enquires, currentPath, messages: req.flash() });
});

exports.enquireDelete = catchAsyncErrors(async (req, res, next) => {
  const enquireId = req.params.id;
  try {
    const deletedenquire = await ContactUs.findByIdAndDelete(enquireId);
    req.flash("success", "Enquiry Delete Successfully");
    return res.redirect("/admin/enquiry");
  } catch (error) {
    console.error("Error Enquire:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// *************************************** blogs all route *************************

exports.allBlogs = catchAsyncErrors(async (req, res, next) => {
  const blogs = await Blogs.find();
  const currentPath = req.path;
  res.render("Admin/allBlogs", { blogs, currentPath, messages: req.flash() });
});

exports.BlogsDetails = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const blogss = await Blogs.find();
  const blogsId = req.params.id;
  const blogs = await Blogs.findById(blogsId).populate("Comments").exec();

  if (!blogs) {
    req.flash("warning", "Blog not found");
    res.redirect("/admin/dashboard/blogs/all-blogs");
  }

  res.render("Admin/blogsDetails", {
    blogs,
    currentPath,
    messages: req.flash(),
    comments: blogs.Comments,
    blogss,
  });
});

exports.blogs_view = catchAsyncErrors(async (req, res, next) => {
  res.render("Admin/blogsDetails");
});

exports.createBlogs = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const trainings = await Trainings.find();
  res.render("Admin/createBlogs", {
    trainings,
    currentPath,
    messages: req.flash(),
  });
});

exports.addBlogs = catchAsyncErrors(async (req, res, next) => {
  try {
    const { blogimg, blogProfile, ...blogData } = req.body;

    const Blog = new Blogs(blogData);

    if (!req.files || !req.files.blogimg) {
      req.flash("warning", "Blog Image Required");
      return res.redirect("/admin/dashboard/blogs/create_blogs");
    }

    const blogimgfile = req.files.blogimg;
    const modifiedFileName = `blogimg-${Date.now()}${path.extname(
      blogimgfile.name
    )}`;

    if (Blog.blogimg && Blog.blogimg.fileId !== "") {
      await imagekit.deleteFile(Blog.blogimg.fileId);
    }

    const { fileId: blogimgFileId, url: blogimgUrl } = await imagekit.upload({
      file: blogimgfile.data,
      fileName: modifiedFileName,
    });

    Blog.blogimg = { fileId: blogimgFileId, url: blogimgUrl };

    if (req.files.blogProfile) {
      const blogProfilefile = req.files.blogProfile;
      const modifiedProfileFileName = `blogProfile-${Date.now()}${path.extname(
        blogProfilefile.name
      )}`;

      if (Blog.blogProfile && Blog.blogProfile.fileId !== "") {
        await imagekit.deleteFile(Blog.blogProfile.fileId);
      }

      const { fileId: blogProfileFileId, url: blogProfileUrl } =
        await imagekit.upload({
          file: blogProfilefile.data,
          fileName: modifiedProfileFileName,
        });

      Blog.blogProfile = { fileId: blogProfileFileId, url: blogProfileUrl };
    } else {
      Blog.blogProfile = {
        fileId: "",
        url: "http://localhost:8080/Frontend/newimg/logo.png",
      };
    }

    await Blog.save();

    req.flash("success", "Blog Added Successfully");
    res.redirect("/admin/dashboard/blogs/all-blogs");
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while adding the blog");
    res.redirect("/admin/dashboard/blogs/create_blogs");
  }
});

exports.blogCommentsDelete = catchAsyncErrors(async (req, res, next) => {
  const commentIdToDelete = req.params.id;
  const commentToDelete = await Comments.findById(commentIdToDelete).exec();

  if (!commentToDelete) {
    req.flash("warning", "Comment not found.");
  } else {
    const blogId = commentToDelete.Blog;

    await Blogs.findByIdAndUpdate(blogId, {
      $pull: { Comments: commentIdToDelete },
    }).exec();

    // Remove comment
    await Comments.findByIdAndDelete(commentIdToDelete).exec();

    req.flash("success", "Comment Deleted Successfully");
  }

  res.redirect(req.get("referer"));
});

exports.blogStatus = catchAsyncErrors(async (req, res, next) => {
  const blogId = req.body.blog;
  try {
    const blog = await Blogs.findOne({ _id: blogId });

    if (!blog) {
      req.flash("warning", "Blog not found");
      res.redirect(req.get("referer"));
    }

    blog.status = blog.status === "Active" ? "Inactive" : "Active";
    await blog.save();
    req.flash("success", "Training Status Update Successfully");
    res.redirect(req.get("referer"));
  } catch (error) {
    req.flash("error", "Internal Server Error");
    res.redirect(req.get("referer"));
  }
});

exports.blogDelete = catchAsyncErrors(async (req, res, next) => {
  const blogId = req.params.id;
  try {
    const deletedBlog = await Blogs.findOneAndDelete({ _id: blogId }).exec();

    if (deletedBlog) {
      const deletedComments = await Comments.deleteMany({
        Blog: blogId,
      }).exec();

      if (deletedComments) {
        req.flash(
          "success",
          "Blog and associated comments deleted successfully"
        );
      } else {
        req.flash("error", "Error deleting associated comments");
      }
    } else {
      req.flash("error", "Blog not found");
    }

    res.redirect(req.get("referer"));
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.redirect(req.get("referer"));
  }
});

exports.blogEdit = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;

  const blogId = req.params.id;
  const blog = await Blogs.findById(blogId);

  if (!blog) {
    req.flash("warning", "Training not found");
    res.redirect(req.get("referer"));
  }
  res.render("Admin/blogsView", {
    blog,
    currentPath,
    messages: req.flash(),
  });
});

exports.blogupdate = catchAsyncErrors(async (req, res, next) => {
  await Blogs.findByIdAndUpdate(req.params.id, req.body).exec();
  req.flash("success", "Blogs Update Successfully");
  res.redirect("/admin/dashboard/blogs/all-blogs");
});

exports.blogimgupdate = catchAsyncErrors(async (req, res, next) => {
  const Blog = await Blogs.findById(req.params.id).exec();

  if (!Blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  try {
    if (req.files.blogimg) {
      const blogimgfile = req.files.blogimg;
      const modifiedBlogName = `blogimg-${Date.now()}${path.extname(
        blogimgfile.name
      )}`;

      if (Blog.blogimg && Blog.blogimg.fileId !== "") {
        await imagekit.deleteFile(Blog.blogimg.fileId);
      }

      const { fileId, url } = await imagekit.upload({
        file: blogimgfile.data,
        fileName: modifiedBlogName,
      });

      Blog.blogimg = { fileId, url };
    }

    if (req.files.blogProfile) {
      const blogProfilefile = req.files.blogProfile;
      const modifiedblogProfileName = `blogProfile-${Date.now()}${path.extname(
        blogProfilefile.name
      )}`;

      if (Blog.blogProfile && Blog.blogProfile.fileId !== "") {
        await imagekit.deleteFile(Blog.blogProfile.fileId);
      }

      const { fileId, url } = await imagekit.upload({
        file: blogProfilefile.data,
        fileName: modifiedblogProfileName,
      });

      Blog.blogProfile = { fileId, url };
    }

    await Blog.save();
    req.flash("success", "Blog Image Update Successfully");
    return res.redirect("/admin/dashboard/blogs/all-blogs");
  } catch (error) {
    req.flash("error", "something went wrong");
    res.redirect(req.get("referer"));
  }
});

// *************************************** blogs all route *************************

// *************************************** trainings all route *************************

exports.alltrainings = catchAsyncErrors(async (req, res, next) => {
  const trainingEvents = await TrainingEvents.find();

  const students = await Student.find();
  const studentId = req.params.id;
  const student = await Student.findById(studentId);

  const currentPath = req.path;
  res.render("Admin/alltrainings", {
    trainingEvents,
    currentPath,
    students,
    student,
    messages: req.flash(),
  });
});

exports.createtrainings = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const trainings = await Trainings.find();
  res.render("Admin/createtrainings", {
    trainings,
    currentPath,
    messages: req.flash(),
  });
});

exports.addcreatetrainings = catchAsyncErrors(async (req, res, next) => {
  try {
    const { trainingBanner, trainingProfile, ...trainingData } = req.body;

    const trainingEvent = new TrainingEvents(trainingData);

    if (!req.files || !req.files.trainingBanner) {
      req.flash("warning", "Training Banner Required");
      return res.redirect("/admin/trainings/create-trainings");
    }

    const trainingBannerFile = req.files.trainingBanner;
    const modifiedBannerFileName = `trainingBanner-${Date.now()}${path.extname(
      trainingBannerFile.name
    )}`;

    if (
      trainingEvent.trainingBanner &&
      trainingEvent.trainingBanner.fileId !== ""
    ) {
      await imagekit.deleteFile(trainingEvent.trainingBanner.fileId);
    }

    const { fileId: trainingBannerFileId, url: trainingBannerUrl } =
      await imagekit.upload({
        file: trainingBannerFile.data,
        fileName: modifiedBannerFileName,
      });

    trainingEvent.trainingBanner = {
      fileId: trainingBannerFileId,
      url: trainingBannerUrl,
    };

    if (req.files.trainingProfile) {
      const trainingProfileFile = req.files.trainingProfile;
      const modifiedProfileFileName = `trainingProfile-${Date.now()}${path.extname(
        trainingProfileFile.name
      )}`;

      if (
        trainingEvent.trainingProfile &&
        trainingEvent.trainingProfile.fileId !== ""
      ) {
        await imagekit.deleteFile(trainingEvent.trainingProfile.fileId);
      }

      const { fileId: trainingProfileFileId, url: trainingProfileUrl } =
        await imagekit.upload({
          file: trainingProfileFile.data,
          fileName: modifiedProfileFileName,
        });

      trainingEvent.trainingProfile = {
        fileId: trainingProfileFileId,
        url: trainingProfileUrl,
      };
    } else {
      trainingEvent.trainingProfile = {
        fileId: "",
        url: "http://localhost:8080/Frontend/newimg/logo.png",
      };
    }

    await trainingEvent.save();

    req.flash("success", "Training Added Successfully");
    res.redirect("/admin/trainings/current-trainings");
  } catch (error) {
    console.error(error);
    req.flash("error", "An error occurred while adding the blog");
    res.redirect("/admin/dashboard/blogs/create_blogs");
  }
});

exports.trainings_view = catchAsyncErrors(async (req, res, next) => {
  res.render("Admin/trainingsDetails");
});

exports.trainingsDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    const currentPath = req.path;

    const trainingEvents = await TrainingEvents.find();

    const trainingEventsId = req.params.id;
    const event = await TrainingEvents.findById(trainingEventsId);

    if (!event) {
      req.flash("warning", "Training Event not found");
      return res.redirect("/admin/dashboard/blogs/all-blogs");
    }

    res.render("Admin/trainingsDetails", {
      currentPath,
      messages: req.flash(),
      trainingEvents,
      event,
    });
  } catch (error) {
    // Handle any errors that occur during the asynchronous operations
    console.error("Error in trainingsDetails controller:", error);
    req.flash("error", "An error occurred while fetching training details");
    res.redirect("/admin/dashboard/blogs/all-blogs");
  }
});

exports.eventStatus = catchAsyncErrors(async (req, res, next) => {
  const trainingId = req.body.blog;
  try {
    const sevent = await TrainingEvents.findOne({ _id: trainingId });

    if (!sevent) {
      req.flash("warning", "Blog not found");
      res.redirect(req.get("referer"));
    }

    sevent.status = sevent.status === "Active" ? "Inactive" : "Active";
    await sevent.save();
    req.flash("success", "Training Status Update Successfully");
    res.redirect(req.get("referer"));
  } catch (error) {
    req.flash("error", "Internal Server Error");
    res.redirect(req.get("referer"));
  }
});

exports.eventDelete = catchAsyncErrors(async (req, res, next) => {
  const eventId = req.params.id;

  try {
    const eventtraining = await TrainingEvents.findByIdAndDelete(eventId);
    req.flash("success", "Training Delete Successfully");
    res.redirect(req.get("referer"));
  } catch (error) {
    req.flash("warning", "Training Events not found");
    res.redirect(req.get("referer"));
  }
});

exports.eventEdit = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;

  const eventId = req.params.id;
  const event = await TrainingEvents.findById(eventId);

  if (!event) {
    req.flash("warning", "Training not found");
    res.redirect(req.get("referer"));
  }
  res.render("Admin/eventView", {
    event,
    currentPath,
    messages: req.flash(),
  });
});

exports.eventupdate = catchAsyncErrors(async (req, res, next) => {
  await TrainingEvents.findByIdAndUpdate(req.params.id, req.body).exec();
  req.flash("success", "Training Update Successfully");
  res.redirect("/admin/trainings/current-trainings");
});

exports.eventimgupdate = catchAsyncErrors(async (req, res, next) => {
  const trainingEvent = await TrainingEvents.findById(req.params.id).exec();

  if (!trainingEvent) {
    return res.status(404).json({ error: "Training Events not found" });
  }
  try {
    if (req.files.trainingBanner) {
      const trainingBannerFile = req.files.trainingBanner;
      const modifiedBannerFileName = `trainingBanner-${Date.now()}${path.extname(
        trainingBannerFile.name
      )}`;

      if (
        trainingEvent.trainingBanner &&
        trainingEvent.trainingBanner.fileId !== ""
      ) {
        await imagekit.deleteFile(trainingEvent.trainingBanner.fileId);
      }

      const { fileId, url } = await imagekit.upload({
        file: trainingBannerFile.data,
        fileName: modifiedBannerFileName,
      });

      trainingEvent.trainingBanner = { fileId, url };
    }

    if (req.files.trainingProfile) {
      const trainingProfileFile = req.files.trainingProfile;
      const modifiedProfileFileName = `trainingProfile-${Date.now()}${path.extname(
        trainingProfileFile.name
      )}`;

      if (
        trainingEvent.trainingProfile &&
        trainingEvent.trainingProfile.fileId !== ""
      ) {
        await imagekit.deleteFile(trainingEvent.trainingProfile.fileId);
      }

      const { fileId, url } = await imagekit.upload({
        file: trainingProfileFile.data,
        fileName: modifiedProfileFileName,
      });

      trainingEvent.trainingProfile = { fileId, url };
    }

    await trainingEvent.save();
    req.flash("success", "training Event Image Update Successfully");
    return res.redirect("/admin/trainings/current-trainings");
  } catch (error) {
    req.flash("error", "something went wrong");
    res.redirect(req.get("referer"));
  }
});

exports.traininguserdetails = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();

  const currentPath = req.path;
  const openingId = req.params.id;
  const opening = await TrainingEvents.findById(openingId);

  if (!opening) {
    req.flash("error", "Training not found");
  }
  res.render("Admin/trainingEvents_user_list", {
    currentPath,
    opening,
    messages: req.flash(),
    students,
  });
});

exports.trainings_user_list = catchAsyncErrors(async (req, res, next) => {
  const students = await Student.find();
  const opening = await TrainingEvents.findById(req.params.id);

  if (!opening) {
    req.flash("error", "Opening not found");
  }

  res.render("Admin/openings_user_list", {
    currentPath,
    opening,
    students,
    messages: req.flash(),
  });
});

// *************************************** trainings all route *************************

// *************************************** addressView all route *************************

exports.teacher = catchAsyncErrors(async (req, res, next) => {
  const currentPath = req.path;
  const students = await Student.find();
  res.render("Admin/teacher", { students, currentPath, messages: req.flash() });
});

exports.addressView = catchAsyncErrors(async (req, res, next) => {
  try {
    // Fetch data from the database
    const students = await Student.find();
    const currentPath = req.path;
    
    const addresses = await Address.find();
    const uniqueStates = Array.from(new Set(addresses.map(address => address.state)));

    res.render("Admin/addressView", {
      uniqueStates,
      addresses,
      messages: req.flash(),
      currentPath,
      students,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


exports.addressSave = catchAsyncErrors(async (req, res, next) => {
  const address = await new Address(req.body).save();
  req.flash("success", "Address Add Successfully");
  res.redirect("/admin/dashboard/addressView");
});

// *************************************** addressView all route *************************
