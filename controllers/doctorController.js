// controllers/doctorController.js

const Doctor =
  require("../models/doctorModel");

const admin =
  require("../config/firebase");

const bcrypt =
  require("bcryptjs");

const jwt =
  require("jsonwebtoken");

/* =========================
   GENERATE TOKEN
========================= */

const generateToken =
  (id) => {

    return jwt.sign(

      {
        id,
        role: "doctor",
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "30d",
      }

    );

  };

/* =========================
   REGISTER DOCTOR
========================= */

exports.registerDoctor =
  async (req, res) => {

    try {

      const {

        name,
        email,
        password,
        phoneNumber,
        speciality,

      } = req.body;

      /* VALIDATION */

      if (
        !name ||
        !email ||
        !password ||
        !speciality
      ) {

        return res.status(400).json({

          success: false,

          message:
            "All required fields are mandatory",

        });

      }

      /* CHECK EXISTING */

      const existingDoctor =
        await Doctor.findOne({
          email,
        });

      if (existingDoctor) {

        return res.status(400).json({

          success: false,

          message:
            "Doctor already exists",

        });

      }

      /* HASH PASSWORD */

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      /* CREATE DOCTOR */

      const doctor =
        await Doctor.create({

          name,

          email,

          password:
            hashedPassword,

          phoneNumber,

          speciality,

          isApproved:
            false,

          isBlocked:
            false,

        });

      /* RESPONSE */

      res.status(201).json({

        success: true,

        message:
          "Doctor registered successfully",

        doctor,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   GOOGLE LOGIN
========================= */

exports.googleLoginDoctor =
  async (req, res) => {

    try {

      const { token } =
        req.body;

      /* VALIDATION */

      if (!token) {

        return res.status(400).json({

          success: false,

          message:
            "Firebase token required",

        });

      }

      /* VERIFY TOKEN */

      const decodedToken =
        await admin
          .auth()
          .verifyIdToken(token);

      const {
        uid,
        email,
        name,
        picture,
      } = decodedToken;

      /* CHECK EXISTING */

      let doctor =
        await Doctor.findOne({
          email,
        });

      /* CREATE NEW */

      if (!doctor) {

        doctor =
          await Doctor.create({

            name:
              name || "Doctor",

            email,

            password:
              "GOOGLE_LOGIN",

            googleId:
              uid,

            authProvider:
              "google",

            doctorImagePath:
              picture || "",

            speciality:
              "General",

            isApproved:
              true,

            isBlocked:
              false,

          });

      }

      /* TOKEN */

      const jwtToken =
        generateToken(
          doctor._id
        );

      /* RESPONSE */

      res.status(200).json({

        success: true,

        message:
          "Google login successful",

        token:
          jwtToken,

        doctor,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   LOGIN DOCTOR
========================= */

exports.loginDoctor =
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      /* VALIDATION */

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Email and password are required",

        });

      }

      /* FIND DOCTOR */

      const doctor =
        await Doctor.findOne({
          email,
        });

      if (!doctor) {

        return res.status(404).json({

          success: false,

          message:
            "Doctor not found",

        });

      }

      /* GOOGLE LOGIN CHECK */

      if (
        doctor.authProvider ===
        "google"
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Please login with Google",

        });

      }

      /* PASSWORD CHECK */

      const isMatch =
        await bcrypt.compare(

          password,

          doctor.password

        );

      if (!isMatch) {

        return res.status(401).json({

          success: false,

          message:
            "Invalid password",

        });

      }

      /* BLOCK CHECK */

      if (doctor.isBlocked) {

        return res.status(403).json({

          success: false,

          message:
            "Doctor account blocked",

        });

      }

      /* APPROVAL CHECK */

      if (!doctor.isApproved) {

        return res.status(403).json({

          success: false,

          message:
            "Waiting for admin approval",

        });

      }

      /* TOKEN */

      const token =
        generateToken(
          doctor._id
        );

      /* RESPONSE */

      res.status(200).json({

        success: true,

        message:
          "Login successful",

        token,

        doctor,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   GET PROFILE
========================= */

exports.getDoctorProfile =
  async (req, res) => {

    try {

      const doctor =
        await Doctor.findById(
          req.doctor._id
        ).select("-password");

      if (!doctor) {

        return res.status(404).json({

          success: false,

          message:
            "Doctor not found",

        });

      }

      res.status(200).json({

        success: true,

        doctor,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };

/* =========================
   UPDATE PROFILE
========================= */

exports.updateDoctorProfile =
  async (req, res) => {

    try {

      const doctor =
        await Doctor.findById(
          req.doctor._id
        );

      if (!doctor) {

        return res.status(404).json({

          success: false,

          message:
            "Doctor not found",

        });

      }

      Object.keys(req.body)
        .forEach((key) => {

          doctor[key] =
            req.body[key];

        });

      await doctor.save();

      res.status(200).json({

        success: true,

        message:
          "Profile updated successfully",

        doctor,

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };