// const express =
//   require("express");

// const router =
//   express.Router();

// const controller =
//   require(
//     "../controllers/videoCallController"
//   );

// const {
//   protect,
// } = require(
//   "../middleware/authMiddleware"
// );



// // ✅ CREATE CALL
// router.post(
//   "/create",
//   protect,
//   controller.createVideoCall
// );



// // ✅ GET MY CALLS
// router.get(
//   "/my-calls",
//   protect,
//   controller.getMyCalls
// );



// // ✅ COMPLETE CALL
// router.put(
//   "/complete/:id",
//   protect,
//   controller.completeCall
// );

// module.exports =
//   router;




// routes/videoCallRoutes.js

const express =
  require("express");

const router =
  express.Router();



/* =========================
   CONTROLLER
========================= */

const controller =
  require(
    "../controllers/videoCallController"
  );



/* =========================
   MIDDLEWARE
========================= */

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);





/* =====================================================
   🎥 CREATE VIDEO CALL
===================================================== */

router.post(

  "/create",

  protect,

  controller.createVideoCall

);





/* =====================================================
   📞 GET ALL MY CALLS
===================================================== */

router.get(

  "/my-calls",

  protect,

  controller.getMyCalls

);





/* =====================================================
   ⏳ GET UPCOMING CALLS
===================================================== */

router.get(

  "/upcoming",

  protect,

  controller.getUpcomingCalls

);





/* =====================================================
   📜 GET HISTORY CALLS
===================================================== */

router.get(

  "/history",

  protect,

  controller.getHistoryCalls

);





/* =====================================================
   ✅ COMPLETE VIDEO CALL
===================================================== */

router.put(

  "/complete/:id",

  protect,

  controller.completeCall

);





module.exports =
  router;