
const Appointment =
  require(
    "../models/appointmentModel"
  );

const DocsidePrescription =
  require(
    "../models/docsidePrescriptionModel"
  );



/* =====================================================
   ✅ COMPLETE PATIENT MEDICAL HISTORY
===================================================== */

exports.getPatientCompleteCase =
  async (req, res) => {
 
    try {

      const { appointmentId } =
        req.params;



      // =================================================
      // CURRENT APPOINTMENT
      // =================================================

     if (!appointmentId) { return res.status(400).json({ success: false, message: "Appointment ID required", }); } const currentAppointment = await Appointment.findById( appointmentId )

        // ================= USER =================

        .populate({

          path: "userId",

          select:
            `
            fullname
            email
            phone
            image
            `,
        })

        // ================= DOCTOR =================

        .populate({

          path: "doctorId",

          select:
            `
            name
            speciality
            experience
            fees
            image
            city
            state
            `,
        })

        // ================= SYMPTOMS =================

        .populate({

          path: "symptoms",

          select:
            `
            name
            image
            color
            `,
        });



      // =================================================
      // CHECK
      // =================================================

      if (!currentAppointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",
        });

      }



      // =================================================
      // GET ALL APPOINTMENTS OF USER
      // =================================================

 const allAppointments = await Appointment.find({ userId: currentAppointment.userId._id, _id: { $ne: currentAppointment._id, }, })

        .populate({

          path: "doctorId",

          select:
            `
            name
            speciality
            experience
            image
            `,
        })

        .populate({

          path: "symptoms",

          select:
            `
            name
            image
            color
            `,
        })

        .sort({
          createdAt: -1,
        });



      // =================================================
      // GET ALL PRESCRIPTIONS
      // =================================================

      const allPrescriptions =
        await DocsidePrescription.find({

          userId:
            currentAppointment.userId._id,
        })

        // ================= DOCTOR =================

        .populate({

          path: "doctorId",

          select:
            `
            name
            speciality
            image
            `,
        })

        // ================= SYMPTOMS =================

        .populate({

          path: "symptoms",

          select:
            `
            name
            image
            color
            `,
        })

        // ================= MEDICINES =================

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
            stock
            `,
        })

        .sort({
          createdAt: -1,
        });



      // =================================================
      // MERGE TIMELINE
      // =================================================

      const timeline =
        allAppointments.map(
          (appointment) => {

            // FIND PRESCRIPTION
            const prescription =
              allPrescriptions.find(

                (p) =>

                 p.appointmentId && p.appointmentId.toString() === appointment._id.toString()

              );

            return {

              // ================= APPOINTMENT =================

              appointmentId:
                appointment._id,

              date:
                appointment.date,

              time:
                appointment.time,

              reason:
                appointment.reason,

              status:
                appointment.status,

              paymentStatus:
                appointment.paymentStatus,



              // ================= DOCTOR =================

              doctor:
                appointment.doctorId,



              // ================= SYMPTOMS =================

              symptoms:
                appointment.symptoms || [],



              // ================= PRESCRIPTION =================

              prescription:
                prescription || null,



              // ================= MEDICINES =================

              medicines:
                prescription?.medicines || [],



              // ================= DIAGNOSIS =================

              diagnosis:
                prescription?.provisionalDiagnosis || "",



              // ================= NOTES =================

              clinicalNotes:
                prescription?.clinicalNotes || "",



              // ================= LAB TESTS =================

              labInvestigations:
                prescription?.labInvestigations || [],



              createdAt:
                appointment.createdAt,
            };

          }
        );



      // =================================================
      // SUMMARY
      // =================================================

      const summary = {

        totalAppointments:
          allAppointments.length,

        totalPrescriptions:
          allPrescriptions.length,

        completedAppointments:
          allAppointments.filter(

            (a) =>
              a.status ===
              "completed"

          ).length,

        pendingAppointments:
          allAppointments.filter(

            (a) =>
              a.status ===
              "pending"

          ).length,

        cancelledAppointments:
          allAppointments.filter(

            (a) =>
              a.status ===
              "cancelled"

          ).length,

        paidAppointments:
          allAppointments.filter(

            (a) =>
              a.paymentStatus ===
              "PAID"

          ).length,
      };



      // =================================================
      // RESPONSE
      // =================================================

      res.status(200).json({

        success: true,



        // ================= PATIENT =================

        patient:
          currentAppointment.userId,



        // ================= CURRENT =================

        currentAppointment,



        // ================= SUMMARY =================

        summary,



        // ================= FULL HISTORY =================

        medicalTimeline:
          timeline,
      });

    } catch (error) {

      console.log(
        "PATIENT HISTORY ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };

