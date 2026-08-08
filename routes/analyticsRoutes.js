// routes/analyticsRoutes.js

const express =
  require("express");

const router =
  express.Router();



/* =========================
   ✅ CONTROLLER
========================= */

const controller =
  require(
    "../controllers/analyticsController"
  );



/* =========================
   ✅ MIDDLEWARE
========================= */

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);





/* =========================
   📊 ANALYTICS ROUTES
========================= */



// ✅ PATIENT ANALYTICS
router.get(
  "/patient-analytics",
  protect,
  controller.getPatientAnalytics
);



// ✅ DASHBOARD ANALYTICS
router.get(
  "/dashboard",
  protect,
  controller.getDashboardAnalytics
);



// ✅ APPOINTMENT TREND
router.get(
  "/trend",
  protect,
  controller.getAppointmentTrend
);



// ✅ COMMON SYMPTOMS
router.get(
  "/symptoms",
  protect,
  controller.getCommonSymptoms
);



// ✅ EARNINGS ANALYTICS
router.get(
  "/earnings",
  protect,
  controller.getEarningsAnalytics
);





module.exports =
  router;