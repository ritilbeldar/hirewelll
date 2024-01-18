const express = require("express");
const router = express.Router();

const {
  homepage,
  userdashboard,
  currentuser,
  studentsignup,
  studentsignin,
  studentsignout,
  studentsendmail,
  studentforgetlink,
  studentresetpassword,
  studentupdate,
  studentavatar,
  readalljobs,
  readallinternships,
  applyinternship,
  applyjob,
  aboutUs,
  blogDetails,
  blogGrid,
  contactUs,
  events,
  founders,
  jobDescription,
  jollyPhonics,
  openings,
  preSchoolSetups,
  recruitment,
  solutions,
  training,
  trainingTopics,
  contactUsdata,
  notfound,
  tecaboutUs,
  tecrecruitment,
  tectraining,
  tecpreSchoolSetups,
  tecblogDetails,
  tecblogGrid,
  teccontactUs,
  tecevents,
  tecfounders,
  tecjobDescription,
  tecjollyPhonics,
  tecopenings,
  tecsolutions,
  tectrainingTopics,
  jobDescriptiondetails,
  removejob,
  blogComments,
  trainingsEventsDetails,
  tectrainingsEventsDetails,
  applyevent,
  removeevent,

  sendOtp,
} = require("../controllers/indexController");
const { isAuthenticated } = require("../middlewares/auth");

// router.post("/send-otp", sendOtp);

// GET /
router.get("/404", notfound);

router.get("/", homepage);

router.get("/aboutUs", aboutUs);
router.get("/teacher/aboutUs", isAuthenticated, tecaboutUs);
router.get("/recruitment", recruitment);
router.get("/teacher/recruitment", isAuthenticated, tecrecruitment);
router.get("/training", training);
router.get("/teacher/training", isAuthenticated, tectraining);
router.get("/preSchoolSetups", preSchoolSetups);
router.get("/teacher/preSchoolSetups", isAuthenticated, tecpreSchoolSetups);

router.get("/blogDetails/:id", blogDetails);

router.get("/teacher/blogDetails/:id", isAuthenticated, tecblogDetails);

router.get("/blogGrid", blogGrid);

router.get("/teacher/blogGrid", isAuthenticated, tecblogGrid);

router.get("/contactUs", contactUs);
router.get("/teacher/contactUs", isAuthenticated, teccontactUs);
router.post("/contactUsdata", contactUsdata);

router.get("/events", events);

router.get("/trainings-Events-Detailss/:id", trainingsEventsDetails);

router.get(
  "/teacher/trainings-Events-Detailss/:id",
  isAuthenticated,
  tectrainingsEventsDetails
);

router.get("/founders", founders);

router.get("/jobDescription", jobDescription);
router.get("/openings", openings);

router.get("/jobDescription/:id", jobDescriptiondetails);
router.get("/teacher/jobDescription/:id", isAuthenticated, tecjobDescription);

router.get("/jollyPhonics", jollyPhonics);
router.get("/solutions", solutions);
router.get("/trainingTopics", trainingTopics);

router.get("/teacher/events", isAuthenticated, tecevents);
router.get("/teacher/founders", isAuthenticated, tecfounders);
router.get("/teacher/jollyPhonics", isAuthenticated, tecjollyPhonics);
router.get("/teacher/openings", isAuthenticated, tecopenings);
router.get("/teacher/solutions", isAuthenticated, tecsolutions);
router.get("/teacher/trainingTopics", isAuthenticated, tectrainingTopics);

// POST /teacher

router.get("/teacher", isAuthenticated, currentuser);

router.get("/teacher/dashboard", isAuthenticated, userdashboard);

// POST /teacher/signup
router.post("/teacher/signup/", studentsignup);

// POST /teacher/signin
router.post("/teacher/signin/", studentsignin);

// GET /teacher/signout
router.get("/teacher/signout", isAuthenticated, studentsignout);

router.post("/submitComment/:id", blogComments);

router.get("/teacher/apply/job/:id", isAuthenticated, applyjob);

router.get("/teacher/remove/job/:id", isAuthenticated, removejob);


router.get("/teacher/apply/event/:id", isAuthenticated, applyevent);

router.get("/teacher/remove/opening/:id", isAuthenticated, removeevent);




// POST /teacher/send-mail
router.post("/teacher/send-mail", studentsendmail);

// GET /teacher/forget-link/:studentid
router.get("/teacher/forget-link/:id", studentforgetlink);

// POST /teacher/reset-password/:studentid
router.post(
  "/teacher/reset-password/:id",
  isAuthenticated,
  studentresetpassword
);

// POST /teacher/update/:studentid
router.post("/teacher/update/:id", isAuthenticated, studentupdate);

// POST /teacher/avatar/:studentid
router.post("/teacher/avatar/:id", isAuthenticated, studentavatar);

// --------------------read all jobs-----------------------------
router.post("/teacher/alljobs/", isAuthenticated, readalljobs);

// --------------------read all jobs-----------------------------
router.post("/teacher/allinternships/", isAuthenticated, readallinternships);

// ------------apply internship--------------
// POST /teacher/apply/internship/:internshipid
router.post(
  "/teacher/apply/internship/:internshipid",
  isAuthenticated,
  applyinternship
);

// ------------apply job--------------
// POST /teacher/apply/job/:jobid

// ------------apply job--------------

module.exports = router;
