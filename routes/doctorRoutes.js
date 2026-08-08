// routes/doctorRoutes.js

const express =
  require("express");

const router =
  express.Router();

const multer =
  require("multer");

const path =
  require("path");

/* =========================
   CONTROLLERS
========================= */

const {

  registerDoctor,

  loginDoctor,

  getDoctorProfile,

  updateDoctorProfile,

  googleLoginDoctor,

} = require(
  "../controllers/doctorController"
);

/* =========================
   MIDDLEWARE
========================= */

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

/* =========================
   MULTER STORAGE
========================= */

const storage =
  multer.diskStorage({

    destination:
      function (
        req,
        file,
        cb
      ) {

        cb(
          null,
          "uploads/"
        );

      },

    filename:
      function (
        req,
        file,
        cb
      ) {

        cb(

          null,

          Date.now() +

            path.extname(
              file.originalname
            )

        );

      },

  });

/* =========================
   MULTER
========================= */

const upload =
  multer({
    storage,
  });

/* =====================================================
   👨‍⚕️ REGISTER DOCTOR
===================================================== */

router.post(

  "/register",

  upload.fields([

    {
      name:
        "doctorImagePath",

      maxCount: 1,
    },

    {
      name:
        "clinicImagePath",

      maxCount: 1,
    },

    {
      name:
        "medicalLicenseCopy",

      maxCount: 1,
    },

    {
      name:
        "idProof",

      maxCount: 1,
    },

  ]),

  registerDoctor

);

/* =====================================================
   🔐 LOGIN DOCTOR
===================================================== */

router.post(

  "/login",

  loginDoctor

);

/* =====================================================
   🔥 GOOGLE LOGIN
===================================================== */

router.post(

  "/google-login",

  googleLoginDoctor

);

/* =====================================================
   👨‍⚕️ GET PROFILE
===================================================== */

router.get(

  "/profile",

  protect,

  getDoctorProfile

);

/* =====================================================
   ✏️ UPDATE PROFILE
===================================================== */

router.put(

  "/update-profile",

  protect,

  upload.fields([

    {
      name:
        "doctorImagePath",

      maxCount: 1,
    },

    {
      name:
        "clinicImagePath",

      maxCount: 1,
    },

    {
      name:
        "medicalLicenseCopy",

      maxCount: 1,
    },

    {
      name:
        "idProof",

      maxCount: 1,
    },

  ]),

  updateDoctorProfile

);

module.exports =
  router;