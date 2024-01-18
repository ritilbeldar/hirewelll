const express = require("express");
const router = express.Router();

const {
  dashboard,
  teacher,
  school,
  teacher_add,
  login,
  adminsignup,
  adminsignout,
  adminsignin,
  teacherDetails,
  teacher_view,
  teacherEdit,
  teacherDelete,
  teacherupdate,
  teacherresumeupdate,
  teacherStatus,
  schoolStatus,
  addteacher,
  school_view,
  schoolDetails,
  schoolDelete,
  schoolEdit,
  schoolupdate,
  school_add,
  addschool,
  training,
  training_view,
  trainingDetails,
  trainingDelete,
  trainingEdit,
  trainingupdate,
  training_add,
  addtraining,
  trainingStatus,
  enquire,
  enquireDelete,
  allBlogs,
  addBlogs,
  createBlogs,
  blogs_view,
  BlogsDetails,
  blogCommentsDelete,
  blogStatus,
  blogDelete,
  blogEdit,
  blogupdate,
  blogimgupdate,

  alltrainings,
  createtrainings,
  addcreatetrainings,
  trainingsDetails,
  eventStatus,
  eventDelete,
  eventEdit,
  eventupdate,
  eventimgupdate,
  addressSave,

  traininguserdetails,
  trainings_user_list,

  addressView,
} = require("../controllers/adminController");
const { adminisAuthenticated } = require("../middlewares/adminauth");

// *************************************** login singin logout route *************************

router.get("/admin/login", login);

router.post("/admin/signup", adminsignup);

router.post("/admin/signin", adminsignin);

router.get("/admin/dashboard/signout", adminisAuthenticated, adminsignout);

// *************************************** login singin logout route *************************

// GET /
router.get("/admin/dashboard", adminisAuthenticated, dashboard);

// *************************************** teacher all route *************************

// GET
router.get("/admin/teachers", adminisAuthenticated, teacher);

router.get("/admin/teacher_view", adminisAuthenticated, teacher_view);

router.get("/admin/teacher_details/:id", adminisAuthenticated, teacherDetails);

router.get("/admin/teacher_edit/:id", adminisAuthenticated, teacherEdit);

router.get("/admin/teacher_delete/:id", adminisAuthenticated, teacherDelete);

router.post("/admin/teacher_update/:id", adminisAuthenticated, teacherupdate);
router.post(
  "/admin/teacher_resume_update/:id",
  adminisAuthenticated,
  teacherresumeupdate
);

// GET
router.get("/admin/teacher_add", adminisAuthenticated, teacher_add);

router.post("/admin/addteacher", adminisAuthenticated, addteacher);

router.post("/admin/teacher_status", adminisAuthenticated, teacherStatus);

// *************************************** teacher all route *************************

// *************************************** school all route *************************

// GET
router.get("/admin/schools", adminisAuthenticated, school);

router.get("/admin/school_view", adminisAuthenticated, school_view);

router.get("/admin/school_details/:id", adminisAuthenticated, schoolDetails);

router.get("/admin/school_delete/:id", adminisAuthenticated, schoolDelete);

router.get("/admin/school_edit/:id", adminisAuthenticated, schoolEdit);

router.post("/admin/school_update/:id", adminisAuthenticated, schoolupdate);

router.get("/admin/school_add", adminisAuthenticated, school_add);

router.post("/admin/addschool", adminisAuthenticated, addschool);

router.post("/admin/school_status", adminisAuthenticated, schoolStatus);

// *************************************** school all route *************************

// *************************************** training all route *************************

// GET
router.get("/admin/trainings", adminisAuthenticated, training);

router.post("/admin/training_status", adminisAuthenticated, trainingStatus);

router.get("/admin/training_view", adminisAuthenticated, training_view);

router.get(
  "/admin/training_details/:id",
  adminisAuthenticated,
  trainingDetails
);

router.get("/admin/training_delete/:id", adminisAuthenticated, trainingDelete);

router.get("/admin/training_edit/:id", adminisAuthenticated, trainingEdit);

router.post("/admin/training_update/:id", adminisAuthenticated, trainingupdate);

router.post("/admin/addtraining", adminisAuthenticated, addtraining);

router.get("/admin/training_add", adminisAuthenticated, training_add);

// router.post("/addtraining",adminisAuthenticated, addtraining);

// *************************************** training all route *************************

router.get("/admin/enquiry", adminisAuthenticated, enquire);

router.get("/admin/enquireDelete/:id", adminisAuthenticated, enquireDelete);

// *************************************** blogs all route *************************

router.get("/admin/dashboard/blogs/all-blogs", adminisAuthenticated, allBlogs);

router.get(
  "/admin/dashboard/blogs/all-blogs/blogs_view",
  adminisAuthenticated,
  blogs_view
);

router.get(
  "/admin/dashboard/blogs/all-blogs/blogs_details/:id",
  adminisAuthenticated,
  BlogsDetails
);

router.get(
  "/admin/dashboard/blogs/create_blogs",
  adminisAuthenticated,
  createBlogs
);

router.post("/admin/dashboard/blogs/addBlogs", adminisAuthenticated, addBlogs);

router.get(
  "/admin/comment_delete/:id",
  adminisAuthenticated,
  blogCommentsDelete
);

router.post("/admin/blog_status", adminisAuthenticated, blogStatus);

router.get("/admin/blog_delete/:id", adminisAuthenticated, blogDelete);

router.get("/admin/blog_edit/:id", adminisAuthenticated, blogEdit);

router.post("/admin/blog_update/:id", adminisAuthenticated, blogupdate);

router.post("/admin/blog_img_update/:id", adminisAuthenticated, blogimgupdate);

// *************************************** blogs all route *************************

// *************************************** trainings all route *************************

router.get(
  "/admin/trainings/current-trainings",
  adminisAuthenticated,
  alltrainings
);

router.get(
  "/admin/trainings/create-trainings",
  adminisAuthenticated,
  createtrainings
);

router.post(
  "/admin/trainings/addcreatetrainings",
  adminisAuthenticated,
  addcreatetrainings
);

router.get(
  "/admin/trainings/current-trainings/trainings_details/:id",
  adminisAuthenticated,
  trainingsDetails
);

router.post("/admin/event_status", adminisAuthenticated, eventStatus);

router.get("/admin/event_delete/:id", adminisAuthenticated, eventDelete);

router.get("/admin/event_edit/:id", adminisAuthenticated, eventEdit);

router.post("/admin/event_update/:id", adminisAuthenticated, eventupdate);

router.post(
  "/admin/event_img_update/:id",
  adminisAuthenticated,
  eventimgupdate
);

router.post("/admin/addressSave", adminisAuthenticated, addressSave);

router.get(
  "/admin/dashboard/trainings/current-trainings/:id",
  adminisAuthenticated,
  traininguserdetails
);

router.get(
  "/admin/dashboard/trainings/current-trainings/training-user-list",
  adminisAuthenticated,
  trainings_user_list
);


router.get(
  "/admin/dashboard/addressView",
  adminisAuthenticated,
  addressView
);

// *************************************** trainings all route *************************

module.exports = router;
