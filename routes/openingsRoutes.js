const express = require("express");
const router = express.Router();

const {
  currentopenings,
  createopenings,
  addopenings,
  createopeningsdetails,
  createopeningsView,
  openingsStatus,
  openingDelete,
  openingEdit,
  openingupdate,
  openings_user_list,
  openingsuserdetails,
} = require("../controllers/openingsController");
const { adminisAuthenticated } = require("../middlewares/adminauth");

// *************************************** Openings route *************************



router.get("/admin/dashboard/openings/current-openings", adminisAuthenticated, currentopenings);

router.get("/admin/dashboard/openings/create-openings", adminisAuthenticated, createopenings);

// post
router.post("/admin/dashboard/openings/addopenings", adminisAuthenticated, addopenings);

router.get("/admin/dashboard/openings/create-details/:id", adminisAuthenticated, createopeningsdetails);

router.get("/admin/opening_delete/:id", adminisAuthenticated, openingDelete);


router.get("/admin/opening_edit/:id", adminisAuthenticated, openingEdit);

router.post("/admin/opening_update/:id", adminisAuthenticated, openingupdate);


router.get("/admin/dashboard/openings/current-openings-view", adminisAuthenticated, createopeningsView);

router.post("/admin/openings_status", adminisAuthenticated, openingsStatus);

router.get("/admin/dashboard/openings/current-openings/:id", adminisAuthenticated, openingsuserdetails);


router.get("/admin/dashboard/openings/current-openings/openings-user-list", adminisAuthenticated, openings_user_list);



// *************************************** Openings route *************************



module.exports = router;
