// routes/doctorScheduleRoutes.js

const express =
  require("express");

const router =
  express.Router();



/* =========================
   ✅ CONTROLLER
========================= */

const controller =
  require(
    "../controllers/doctorScheduleController"
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
   👨‍⚕️ DOCTOR ROUTES
========================= */



// ✅ CREATE SCHEDULE
router.post(
  "/",
  protect,
  controller.createSchedule
);



// ✅ GET MY SCHEDULES
router.get(
  "/my",
  protect,
  controller.getMySchedules
);



// ✅ GET SINGLE SCHEDULE
router.get(
  "/:id",
  protect,
  controller.getSingleSchedule
);



// ✅ UPDATE SCHEDULE
router.put(
  "/:id",
  protect,
  controller.updateSchedule
);



// ✅ DELETE SCHEDULE
router.delete(
  "/:id",
  protect,
  controller.deleteSchedule
);





/* =========================
   👤 USER ROUTES
========================= */



// ✅ GET AVAILABLE DOCTOR SLOTS
router.get(
  "/doctor-slots/:doctorId",
  controller.getDoctorAvailableSlots
);





module.exports =
  router;