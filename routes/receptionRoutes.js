// routes/receptionRoutes.js

const express =
  require("express");

const router =
  express.Router();

const {

  createReception,

  loginReception,

  getDoctorReceptions,

  getSingleReception,

  deleteReception,

} = require(

  "../controllers/receptionController"

);

const {

  protect,

  doctorOnly,

  receptionOnly,

} = require(

  "../middleware/authMiddleware"

);



// ======================================================
// DOCTOR CREATE RECEPTION
// ======================================================

router.post(

  "/create",

  protect,

  doctorOnly,

  createReception

);



// ======================================================
// RECEPTION LOGIN
// ======================================================

router.post(

  "/login",

  loginReception

);



// ======================================================
// GET ALL DOCTOR RECEPTIONS
// ======================================================

router.get(

  "/my-receptions",

  protect,

  doctorOnly,

  getDoctorReceptions

);



// ======================================================
// GET SINGLE RECEPTION
// ======================================================

router.get(

  "/:id",

  protect,

  doctorOnly,

  getSingleReception

);



// ======================================================
// DELETE RECEPTION
// ======================================================

router.delete(

  "/delete/:id",

  protect,

  doctorOnly,

  deleteReception

);



module.exports =
  router;