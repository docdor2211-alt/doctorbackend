const express = require("express");

const router = express.Router();

const multer = require("multer");

const path = require("path");

const {
  registerDoctor,

  loginDoctor,

  getDoctorProfile,

  updateDoctorProfile,

  googleLoginDoctor,

  getDoctorSettings,

  updateDoctorSettings,

  uploadClinicBranding,
} = require("../controllers/doctorController");

const { protect } = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,

      Date.now() + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage,
});

router.post(
  "/register",

  upload.fields([
    {
      name: "doctorImagePath",

      maxCount: 1,
    },

    {
      name: "clinicImagePath",

      maxCount: 1,
    },

    {
      name: "medicalLicenseCopy",

      maxCount: 1,
    },

    {
      name: "idProof",

      maxCount: 1,
    },
  ]),

  registerDoctor,
);

router.post(
  "/login",

  loginDoctor,
);

router.post(
  "/google-login",

  googleLoginDoctor,
);

router.get(
  "/profile",

  protect,

  getDoctorProfile,
);

router.put(
  "/update-profile",

  protect,

  upload.fields([
    {
      name: "doctorImagePath",

      maxCount: 1,
    },

    {
      name: "clinicImagePath",

      maxCount: 1,
    },

    {
      name: "medicalLicenseCopy",

      maxCount: 1,
    },

    {
      name: "idProof",

      maxCount: 1,
    },
  ]),

  updateDoctorProfile,
);

/* =========================
   ⚙️ DOCTOR & CLINIC SETTINGS
========================= */

router.get(
  "/settings",
  protect,
  getDoctorSettings
);

router.put(
  "/settings",
  protect,
  updateDoctorSettings
);

router.post(
  "/settings/branding",
  protect,
  upload.fields([
    {
      name: "logo",
      maxCount: 1,
    },
    {
      name: "header",
      maxCount: 1,
    },
    {
      name: "footer",
      maxCount: 1,
    },
  ]),
  uploadClinicBranding
);

module.exports = router;
