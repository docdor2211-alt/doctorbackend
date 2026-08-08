const User =
  require("../models/userModel");

const Appointment =
  require("../models/appointmentModel");

const DocsidePrescription =
  require("../models/docsidePrescriptionModel");
require("../models/onlineSymptomModel");
   

/* =====================================================
   ✅ SINGLE USER FULL HISTORY
===================================================== */

exports.getUserFullMedicalHistory =
  async (req, res) => {

    try {

      const { userId } =
        req.params;



      // =================================================
      // USER
      // =================================================

      const user =
        await User.findById(userId)
        .select("-password");



      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User not found",
        });

      }



      // =================================================
      // APPOINTMENTS
      // =================================================

      const appointments =
        await Appointment.find({

          userId,
        })

        .populate({

          path: "doctorId",

          select:
            `
            name
            email
            phoneNumber
            speciality
            experience
            fees
            image
            address
            city
            state
            `,
        })

        .sort({
          createdAt: -1,
        });



      // =================================================
      // PRESCRIPTIONS
      // =================================================

      const prescriptions =
        await DocsidePrescription.find({

          userId,
        })

        // DOCTOR
        .populate({

          path: "doctorId",

          select:
            `
            name
            speciality
            email
            phoneNumber
            image
            `,
        })

        // USER
        .populate({

          path: "userId",

          select:
            `
            fullname
            email
            phone
            `,
        })

        // APPOINTMENT
        .populate({

          path: "appointmentId",

          select:
            `
            patientName
            age
            gender
            reason
            date
            time
            status
            type
            `,
        })

        // SYMPTOMS
        .populate({

          path: "symptoms",

          select:
            `
            name
            color
            image
            `,
        })

        // MEDICINES
        .populate({

          path:
            "medicines.productId",

          select:
            `
            productTitle
            brand
            category
            mrp
            image
            `,
        })

        .sort({
          createdAt: -1,
        });



      // =================================================
      // UNIQUE DOCTORS
      // =================================================

      const uniqueDoctors =
        [
          ...new Map(

            appointments.map((item) => [

              item.doctorId?._id?.toString(),

              item.doctorId

            ])

          ).values()
        ];



      // =================================================
      // UNIQUE SYMPTOMS
      // =================================================

      const symptomsMap =
        new Map();

      prescriptions.forEach((p) => {

        p.symptoms.forEach((s) => {

          symptomsMap.set(
            s._id.toString(),
            s
          );

        });

      });



      const allSymptoms =
        Array.from(
          symptomsMap.values()
        );



      // =================================================
      // RESPONSE
      // =================================================

      res.status(200).json({

        success: true,

        data: {

          // USER
          user,



          // COUNTS
          statistics: {

            totalAppointments:
              appointments.length,

            totalPrescriptions:
              prescriptions.length,

            totalDoctors:
              uniqueDoctors.length,

            totalSymptoms:
              allSymptoms.length,
          },



          // ALL DATA
          appointments,

          prescriptions,

          doctors:
            uniqueDoctors,

          symptoms:
            allSymptoms,
        },
      });

    } catch (error) {

      console.log(
        "FULL HISTORY ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };





/* =====================================================
   ✅ ADMIN ALL USERS HISTORY
===================================================== */

exports.getAllUsersMedicalHistory =
  async (req, res) => {

    try {

      const users =
        await User.find()
        .select("-password");



      const finalData = [];



      for (const user of users) {

        const appointments =
          await Appointment.find({

            userId:
              user._id,
          })

          .populate(
            "doctorId",
            `
            name
            speciality
            image
            `
          );



        const prescriptions =
          await DocsidePrescription.find({

            userId:
              user._id,
          })

          .populate(
            "doctorId",
            `
            name
            speciality
            `
          )

          .populate(
            "symptoms",
            `
            name
            color
            `
          );



        finalData.push({

          user,

          totalAppointments:
            appointments.length,

          totalPrescriptions:
            prescriptions.length,

          appointments,

          prescriptions,
        });

      }



      res.status(200).json({

        success: true,

        totalUsers:
          finalData.length,

        data:
          finalData,
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