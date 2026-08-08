


// routes/docsidePrescriptionRoutes.js

const express =
  require("express");

const router =
  express.Router();


/* =========================
   ✅ CONTROLLERS
========================= */

const {

  createPrescription,

  getAllMedicines,

  getPrescriptionByAppointment,

  updatePrescription,

  deletePrescription,

} = require(
  "../controllers/docsidePrescriptionController"
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
   🩺 PRESCRIPTION ROUTES
========================= */


// ✅ CREATE PRESCRIPTION

router.post(
  "/",
  protect,
  createPrescription
);


// ✅ GET ALL MEDICINES

router.get(
  "/medicines",
  protect,
  getAllMedicines
);


// ✅ GET PRESCRIPTION BY APPOINTMENT

router.get(
  "/appointment/:appointmentId",
  protect,
  getPrescriptionByAppointment
);


// ✅ UPDATE PRESCRIPTION

router.put(
  "/:id",
  protect,
  updatePrescription
);


// ✅ DELETE PRESCRIPTION

router.delete(
  "/:id",
  protect,
  deletePrescription
);


/* =========================
   ✅ EXPORT ROUTER
========================= */

module.exports =
  router;

