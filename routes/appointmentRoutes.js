const express = require("express");

const router = express.Router();

const controller =
  require(
    "../controllers/appointmentController"
  );

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);



/* =========================
   👨‍⚕️ DOCTOR ROUTES
========================= */

// ✅ GET APPOINTMENTS
router.get(
  "/my-appointments",
  protect,
  controller.getDoctorAppointments
);

// ✅ RECEIVE SETTLEMENT
router.put(
  "/settle-payment/:id",

  protect,

  controller.receiveSettlement
);


// ✅ UPDATE VITALS
router.put(
  "/:id/vitals",
  protect,
  controller.updateVitals
);

// ✅ GET DOCTOR EARNINGS
router.get(
  "/my-earnings",
  protect,
  controller.getDoctorEarnings
);



// ✅ COMPLETE
router.put(
  "/:id/complete",
  protect,
  controller.completeAppointment
);

// ✅ CANCEL
router.put(
  "/:id/cancel",
  protect,
  controller.cancelAppointment
);

module.exports =
  router;