


const express = require("express");

const router = express.Router();


// ================= CONTROLLERS =================

const {

  getMyPrescriptions,

  getSinglePrescription,

} = require(
  "../controllers/prescriptionController"
);


// ================= MIDDLEWARE =================

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);


// =====================================================
// ============ GET MY PRESCRIPTIONS ===================
// =====================================================

router.get(

  "/my",

  protect,

  getMyPrescriptions
);


// =====================================================
// ============ GET SINGLE PRESCRIPTION ================
// =====================================================

router.get(

  "/:id",

  protect,

  getSinglePrescription
);


// ================= EXPORT =================

module.exports = router;