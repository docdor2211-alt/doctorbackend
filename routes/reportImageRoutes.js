const express =
  require("express");

const router =
  express.Router();

const {

  getDoctorImages,

} = require(
  "../controllers/reportImageController"
);

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);



// ======================================================
// DOCTOR GET IMAGES
// ======================================================

router.get(

  "/doctor-images",

  protect,

  getDoctorImages

);



module.exports =
  router;