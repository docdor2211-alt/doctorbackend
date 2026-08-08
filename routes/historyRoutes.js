const express =
  require("express");

const router =
  express.Router();



// =====================================================
// CONTROLLERS
// =====================================================

const historyController =
  require(
    "../controllers/historyController"
  );



// =====================================================
// MIDDLEWARE
// =====================================================

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );




/* =====================================================
   SINGLE USER HISTORY
===================================================== */

router.get(

  "/user/:userId",

  authMiddleware.protect,

  historyController.getUserFullMedicalHistory
);




/* =====================================================
   ALL USERS HISTORY
===================================================== */

router.get(

  "/all-users",

  authMiddleware.protect,

  historyController.getAllUsersMedicalHistory
);




/* =====================================================
   EXPORT
===================================================== */

module.exports =
  router;