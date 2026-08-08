

const jwt = require("jsonwebtoken");

const Prescription = require(
  "../models/docsidePrescriptionModel"
);


// =====================================================
// ============ GET MY PRESCRIPTIONS ===================
// =====================================================

exports.getMyPrescriptions =
  async (req, res) => {

    try {

      // ================= TOKEN =================

      let token;

      if (

        req.headers.authorization &&

        req.headers.authorization.startsWith(
          "Bearer"
        )

      ) {

        token =
          req.headers.authorization.split(
            " "
          )[1];

      }

      // ================= TOKEN CHECK =================

      if (!token) {

        return res.status(401).json({

          success: false,

          message:
            "Token missing",

        });

      }

      // ================= VERIFY TOKEN =================

      const decoded =
        jwt.verify(

          token,

          process.env.JWT_SECRET
        );

      console.log(
        "TOKEN USER ID =>",
        decoded.id
      );

      // ================= FIND ALL =================

      const prescriptions =
        await Prescription.find()

        .sort({

          createdAt: -1,

        });

      console.log(
        "TOTAL PRESCRIPTIONS =>",
        prescriptions.length
      );

      // ================= RESPONSE =================

      res.status(200).json({

        success: true,

        message:
          "Prescriptions fetched successfully",

        total:
          prescriptions.length,

        data:
          prescriptions,

      });

    } catch (error) {

      console.log(
        "GET PRESCRIPTIONS ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};


// =====================================================
// ============ GET SINGLE PRESCRIPTION ================
// =====================================================

exports.getSinglePrescription =
  async (req, res) => {

    try {

      // ================= FIND =================

      const prescription =
        await Prescription.findById(

          req.params.id

        );

      // ================= CHECK =================

      if (!prescription) {

        return res.status(404).json({

          success: false,

          message:
            "Prescription not found",

        });

      }

      // ================= RESPONSE =================

      res.status(200).json({

        success: true,

        data:
          prescription,

      });

    } catch (error) {

      console.log(
        "GET SINGLE PRESCRIPTION ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};
const axios = require("axios");


// ======================================================
// MEDICINE DROPDOWN
// ======================================================

exports.getMedicineDropdown =
  async (req, res) => {

    try {

      const response = await axios.get(
        `${process.env.PHARMACY_API}/api/pharmacy-products/dropdown`
      );

      res.status(200).json({

        success: true,

        total:
          response.data.data.length,

        data:
          response.data.data,

      });

    } catch (error) {

      console.log(
        "MEDICINE DROPDOWN ERROR =>",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};


// ======================================================
// SYMPTOMS DROPDOWN
// ======================================================

exports.getSymptomsDropdown =
  async (req, res) => {

    try {

      const response = await axios.get(
        `${process.env.SYMPTOM_API}/api/online-symptoms/dropdown`
      );

      res.status(200).json({

        success: true,

        total:
          response.data.data.length,

        data:
          response.data.data,

      });

    } catch (error) {

      console.log(
        "SYMPTOMS DROPDOWN ERROR =>",
        error.message
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

};