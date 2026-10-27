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
      // MEDICAL TIMELINE (Vitals, Clinical Details, Medicines)
      // =================================================

      const medicalTimeline = appointments.map((appointment) => {
        const prescription = prescriptions.find(
          (p) =>
            p.appointmentId &&
            (p.appointmentId._id
              ? p.appointmentId._id.toString()
              : p.appointmentId.toString()) === appointment._id.toString()
        );

        return {
          appointmentId: appointment._id,
          date: appointment.date,
          time: appointment.time,
          reason: appointment.reason,
          status: appointment.status,
          doctor: appointment.doctorId,
          vitals: {
            weight:
              prescription?.vitalSigns?.weight ||
              appointment.weight ||
              "",
            temperature:
              prescription?.vitalSigns?.temperature ||
              appointment.temperature ||
              "",
            pulse:
              prescription?.vitalSigns?.pulse ||
              appointment.pulse ||
              "",
            bloodPressure:
              prescription?.vitalSigns?.bloodPressure ||
              appointment.bloodPressure ||
              "",
            spO2:
              prescription?.vitalSigns?.spO2 ||
              appointment.spO2 ||
              "",
          },
          clinicalDetails: {
            complaints:
              prescription?.complaints?.length > 0
                ? prescription.complaints
                : prescription?.chiefComplaints
                ? [prescription.chiefComplaints]
                : appointment.reason
                ? [appointment.reason]
                : [],
            patientHistory: prescription?.patientHistory || "",
            diagnosis:
              prescription?.diagnosis ||
              prescription?.provisionalDiagnosis ||
              "",
            examinationFindings: prescription?.examinationFindings || "",
            clinicalNotes: prescription?.clinicalNotes || "",
            labInvestigations: prescription?.labInvestigations || [],
            dietaryAdvice: prescription?.dietaryAdvice || {
              itemsToEat: [],
              itemsToAvoid: [],
              lifestyleAdvice: prescription?.dietaryInstructions || "",
              notes: "",
            },
            services: prescription?.services || [],
          },
          medicines: (prescription?.medicines || []).map((m) => ({
            productId: m.productId,
            medicineName: m.medicineName || m.name || m.productTitle || "",
            dosage: m.dosage || "",
            timeSlots: m.timeSlots || {},
            slots: m.slots || [],
            instruction: m.instruction || m.instructions || "",
            duration: m.duration || "",
            frequency: m.frequency || "",
          })),
          prescription: prescription || null,
          createdAt: appointment.createdAt,
        };
      });

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
          medicalTimeline,

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