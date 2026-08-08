const jwt =
  require("jsonwebtoken");

const Doctor =
  require("../models/doctorModel");

exports.protect =
  async (
    req,
    res,
    next
  ) => {

    try {

      let token =
        req.headers.authorization;

      if (!token) {

        return res.status(401).json({
          success: false,
          message: "No token",
        });

      }

      token =
        token.split(" ")[1];

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      const doctor =
        await Doctor.findById(
          decoded.id
        ).select("-password");

      if (!doctor) {

        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });

      }

      req.doctor =
        doctor;

      next();

    } catch (error) {

      return res.status(401).json({
        success: false,
        message: "Token failed",
      });

    }

  };