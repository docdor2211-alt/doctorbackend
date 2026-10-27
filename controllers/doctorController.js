// controllers/doctorController.js

const Doctor =
  require("../models/doctorModel");

// const admin =
  // require("../config/firebase");

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

/* =========================
   ⚙️ GET DOCTOR SETTINGS
========================= */

exports.getDoctorSettings = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const settings = {
      consultationPricing: {
        newConsultationFee: doctor.consultationPricing?.newConsultationFee ?? (doctor.fees || 500),
        oldConsultationFee: doctor.consultationPricing?.oldConsultationFee ?? 300,
      },
      appointmentLength: doctor.appointmentLength ?? 15,
      newAppointmentThreshold: doctor.newAppointmentThreshold ?? 30,
      clinicBranding: {
        logo: doctor.clinicBranding?.logo ?? "",
        header: doctor.clinicBranding?.header ?? "",
        footer: doctor.clinicBranding?.footer ?? "",
      },
      prescriptionSettings: {
        isVitalSignsEnabled: doctor.prescriptionSettings?.isVitalSignsEnabled ?? true,
        isDietaryAdviceEnabled: doctor.prescriptionSettings?.isDietaryAdviceEnabled ?? true,
      },
      clinicName: doctor.clinicName || "",
      address: doctor.address || "",
    };

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   ⚙️ UPDATE DOCTOR SETTINGS
========================= */

exports.updateDoctorSettings = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const {
      newConsultationFee,
      oldConsultationFee,
      appointmentLength,
      newAppointmentThreshold,
      logo,
      header,
      footer,
      isVitalSignsEnabled,
      isDietaryAdviceEnabled,
      clinicName,
      address,
    } = req.body;

    // Pricing
    if (!doctor.consultationPricing) {
      doctor.consultationPricing = { newConsultationFee: 500, oldConsultationFee: 300 };
    }
    if (newConsultationFee !== undefined) {
      doctor.consultationPricing.newConsultationFee = Number(newConsultationFee);
      doctor.fees = Number(newConsultationFee);
    }
    if (oldConsultationFee !== undefined) {
      doctor.consultationPricing.oldConsultationFee = Number(oldConsultationFee);
    }

    // Appointment Length
    if (appointmentLength !== undefined) {
      doctor.appointmentLength = Number(appointmentLength);
    }

    // New Appointment Threshold
    if (newAppointmentThreshold !== undefined) {
      doctor.newAppointmentThreshold = Number(newAppointmentThreshold);
    }

    // Branding
    if (!doctor.clinicBranding) {
      doctor.clinicBranding = { logo: "", header: "", footer: "" };
    }
    if (logo !== undefined) doctor.clinicBranding.logo = logo;
    if (header !== undefined) doctor.clinicBranding.header = header;
    if (footer !== undefined) doctor.clinicBranding.footer = footer;

    // Prescription Settings
    if (!doctor.prescriptionSettings) {
      doctor.prescriptionSettings = { isVitalSignsEnabled: true, isDietaryAdviceEnabled: true };
    }
    if (isVitalSignsEnabled !== undefined) {
      doctor.prescriptionSettings.isVitalSignsEnabled = Boolean(isVitalSignsEnabled);
    }
    if (isDietaryAdviceEnabled !== undefined) {
      doctor.prescriptionSettings.isDietaryAdviceEnabled = Boolean(isDietaryAdviceEnabled);
    }

    if (clinicName !== undefined) doctor.clinicName = clinicName;
    if (address !== undefined) doctor.address = address;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor and clinic settings updated successfully",
      data: {
        consultationPricing: doctor.consultationPricing,
        appointmentLength: doctor.appointmentLength,
        newAppointmentThreshold: doctor.newAppointmentThreshold,
        clinicBranding: doctor.clinicBranding,
        prescriptionSettings: doctor.prescriptionSettings,
        clinicName: doctor.clinicName,
        address: doctor.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =====================================================
   🖼️ UPLOAD CLINIC BRANDING (LOGO, HEADER, FOOTER)
===================================================== */

exports.uploadClinicBranding = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.doctor._id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    if (!doctor.clinicBranding) {
      doctor.clinicBranding = { logo: "", header: "", footer: "" };
    }

    const host = `${req.protocol}://${req.get("host")}`;

    if (req.files) {
      if (req.files.logo && req.files.logo.length > 0) {
        doctor.clinicBranding.logo = `${host}/uploads/${req.files.logo[0].filename}`;
      }
      if (req.files.header && req.files.header.length > 0) {
        doctor.clinicBranding.header = `${host}/uploads/${req.files.header[0].filename}`;
      }
      if (req.files.footer && req.files.footer.length > 0) {
        doctor.clinicBranding.footer = `${host}/uploads/${req.files.footer[0].filename}`;
      }
    }

    // Also support direct URL links in req.body if passed as text/json
    if (req.body.logo) doctor.clinicBranding.logo = req.body.logo;
    if (req.body.header) doctor.clinicBranding.header = req.body.header;
    if (req.body.footer) doctor.clinicBranding.footer = req.body.footer;

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Clinic branding uploaded successfully",
      data: doctor.clinicBranding,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};