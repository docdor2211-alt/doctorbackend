
const express =
  require("express");

const router =
  express.Router();



/* =========================
   ✅ CONTROLLER
========================= */

const {

  getPatientCompleteCase,

} = require(
  "../controllers/patientCaseController"
);



/* =========================
   ✅ MIDDLEWARE
========================= */

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);



/* =====================================================
   ✅ GET COMPLETE PATIENT CASE
===================================================== */

router.get(

  "/:appointmentId",

  protect,

  getPatientCompleteCase

);



/* =========================
   ✅ EXPORT ROUTER
========================= */

module.exports =
  router;
