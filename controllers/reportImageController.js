const ReportImage =
  require(
    "../models/reportImageModel"
  );
  require(
  "../models/User"
);



// ======================================================
// DOCTOR - GET USER IMAGES
// ======================================================

exports.getDoctorImages =
  async (req, res) => {

    try {

      // ==========================================
      // CHECK DOCTOR
      // ==========================================

      if (!req.doctor) {

        return res.status(401).json({

          success: false,

          message:
            "Doctor not authenticated",

        });

      }



      console.log(
        "DOCTOR ID =>",
        req.doctor._id
      );



      // ==========================================
      // FIND REPORTS
      // ==========================================

      const reports =
        await ReportImage.find({

          doctorId:
            req.doctor._id,

        })

          .populate(

            "userId",

            "fullname email phone image"

          )

          .sort({

            createdAt: -1,

          });



      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(200).json({

        success: true,

        message:
          "Doctor images fetched successfully",

        total:
          reports.length,

        data:
          reports,

      });

    } catch (error) {

      console.log(

        "GET DOCTOR IMAGES ERROR =>",

        error

      );



      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };