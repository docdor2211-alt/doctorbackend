// controllers/receptionController.js

const jwt =
  require("jsonwebtoken");

const Reception =
  require(
    "../models/receptionModel"
  );



// ======================================================
// GENERATE TOKEN
// ======================================================

const generateToken =
  (id, role) => {

    return jwt.sign(

      {

        id,

        role,

      },

      process.env.JWT_SECRET,

      {

        expiresIn: "30d",

      }

    );

  };



// ======================================================
// CREATE RECEPTION
// DOCTOR CREATE KAREGA
// ======================================================

exports.createReception =
  async (req, res) => {

    try {

      // ======================================================
      // CHECK DOCTOR
      // ======================================================

      if (!req.doctor) {

        return res.status(401).json({

          success: false,

          message:
            "Doctor not authenticated",

        });

      }



      const {

        fullname,

        email,

        phone,

        password,

        gender,

        address,

        experience,

        profileImage,

      } = req.body;



      // ======================================================
      // CHECK EMAIL
      // ======================================================

      const alreadyExists =
        await Reception.findOne({

          email,

        });



      if (
        alreadyExists
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Reception already exists",

        });

      }



      // ======================================================
      // CREATE RECEPTION
      // ======================================================

      const reception =
        await Reception.create({

          doctorId:
            req.doctor._id,

          fullname,

          email,

          phone,

          password,

          gender,

          address,

          experience,

          profileImage,

        });



      // ======================================================
      // RESPONSE
      // ======================================================

      res.status(201).json({

        success: true,

        message:
          "Reception created successfully",

        data:
          reception,

      });

    } catch (error) {

      console.log(
        "CREATE RECEPTION ERROR =>",
        error
      );



      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// LOGIN RECEPTION
// ======================================================

exports.loginReception =
  async (req, res) => {

    try {

      const {

        email,

        password,

      } = req.body;



      // ======================================================
      // FIND RECEPTION
      // ======================================================

      const reception =
        await Reception.findOne({

          email,

        }).select("+password");



      if (
        !reception
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid email",

        });

      }



      // ======================================================
      // CHECK BLOCKED
      // ======================================================

      if (
        reception.isBlocked
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Reception account blocked",

        });

      }



      // ======================================================
      // MATCH PASSWORD
      // ======================================================

      const isMatch =
        await reception.matchPassword(

          password

        );



      if (!isMatch) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid password",

        });

      }



      // ======================================================
      // TOKEN
      // ======================================================

      const token =
        generateToken(

          reception._id,

          reception.role

        );



      // ======================================================
      // RESPONSE
      // ======================================================

      res.status(200).json({

        success: true,

        message:
          "Reception login successful",

        token,

        data:
          reception,

      });

    } catch (error) {

      console.log(
        "LOGIN RECEPTION ERROR =>",
        error
      );



      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// GET ALL RECEPTIONS OF DOCTOR
// ======================================================

exports.getDoctorReceptions =
  async (req, res) => {

    try {

      const receptions =
        await Reception.find({

          doctorId:
            req.doctor._id,

        })

        .select("-password")

        .sort({

          createdAt: -1,

        });



      res.status(200).json({

        success: true,

        total:
          receptions.length,

        data:
          receptions,

      });

    } catch (error) {

      console.log(
        "GET RECEPTIONS ERROR =>",
        error
      );



      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// GET SINGLE RECEPTION
// ======================================================

exports.getSingleReception =
  async (req, res) => {

    try {

      const reception =
        await Reception.findOne({

          _id:
            req.params.id,

          doctorId:
            req.doctor._id,

        }).select("-password");



      if (!reception) {

        return res.status(404).json({

          success: false,

          message:
            "Reception not found",

        });

      }



      res.status(200).json({

        success: true,

        data:
          reception,

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// DELETE RECEPTION
// ======================================================

exports.deleteReception =
  async (req, res) => {

    try {

      const reception =
        await Reception.findOne({

          _id:
            req.params.id,

          doctorId:
            req.doctor._id,

        });



      if (!reception) {

        return res.status(404).json({

          success: false,

          message:
            "Reception not found",

        });

      }



      await reception.deleteOne();



      res.status(200).json({

        success: true,

        message:
          "Reception deleted successfully",

      });

    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };