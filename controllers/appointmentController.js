const Appointment =
  require(
    "../models/appointmentModel"
  );



/* =========================
   👨‍⚕️ GET DOCTOR APPOINTMENTS
========================= */

exports.getDoctorAppointments =
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({

          doctorId:
            req.doctor._id,

        })

          .sort({
            createdAt: -1,
          });


      res.status(200).json({

        success: true,

        count:
          appointments.length,

        data:
          appointments,

      });

    } catch (error) {

      console.log(
        "GET DOCTOR APPOINTMENTS ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };





/* =========================
   🩺 UPDATE VITALS
========================= */

exports.updateVitals =
  async (req, res) => {

    try {

      const {

        bloodPressure,
        weight,
        temperature,

      } = req.body;


      // ✅ FIND APPOINTMENT
      const appointment =
        await Appointment.findById(
          req.params.id
        );

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }


      // ✅ CHECK DOCTOR OWNER
      if (
        appointment.doctorId.toString() !==
        req.doctor._id.toString()
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      // ✅ UPDATE VITALS
      appointment.bloodPressure =
        bloodPressure ||
        appointment.bloodPressure;

      appointment.weight =
        weight ||
        appointment.weight;

      appointment.temperature =
        temperature ||
        appointment.temperature;


      await appointment.save();


      res.status(200).json({

        success: true,

        message:
          "Vitals updated successfully",

        data:
          appointment,

      });

    } catch (error) {

      console.log(
        "UPDATE VITALS ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };





/* =========================
   ✅ COMPLETE APPOINTMENT
========================= */

exports.completeAppointment =
  async (req, res) => {

    try {

      // ✅ FIND APPOINTMENT
      const appointment =
        await Appointment.findById(
          req.params.id
        );

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }


      // ✅ CHECK DOCTOR OWNER
      if (
        appointment.doctorId.toString() !==
        req.doctor._id.toString()
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      // ✅ COMPLETE
      appointment.status =
        "completed";

      await appointment.save();


      res.status(200).json({

        success: true,

        message:
          "Appointment completed successfully",

        data:
          appointment,

      });

    } catch (error) {

      console.log(
        "COMPLETE APPOINTMENT ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };





/* =========================
   ❌ CANCEL APPOINTMENT
========================= */

exports.cancelAppointment =
  async (req, res) => {

    try {

      // ✅ FIND APPOINTMENT
      const appointment =
        await Appointment.findById(
          req.params.id
        );

      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",

        });

      }


      // ✅ CHECK DOCTOR OWNER
      if (
        appointment.doctorId.toString() !==
        req.doctor._id.toString()
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }


      // ✅ CANCEL
      appointment.status =
        "cancelled";

      await appointment.save();


      res.status(200).json({

        success: true,

        message:
          "Appointment cancelled successfully",

        data:
          appointment,

      });

    } catch (error) {

      console.log(
        "CANCEL APPOINTMENT ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };
  
/* =========================
   💰 GET DOCTOR EARNINGS
========================= */

exports.getDoctorEarnings =
  async (req, res) => {

    try {

      const appointments =
        await Appointment.find({

          doctorId:
            req.doctor._id,

          paymentStatus:
            "PAID",
        })

        .sort({
          createdAt: -1,
        });




      // =========================
      // TOTAL
      // =========================

      const totalEarning =
        appointments.reduce(

          (acc, item) =>

            acc +
            item.doctorAmount,

          0
        );




      // =========================
      // PENDING
      // =========================

      const pendingAmount =
        appointments

          .filter(

            (item) =>

              item.settlementStatus ===
              "PENDING"

          )

          .reduce(

            (acc, item) =>

              acc +
              item.doctorAmount,

            0
          );




      // =========================
      // SETTLED
      // =========================

      const settledAmount =
        appointments

          .filter(

            (item) =>

              item.settlementStatus ===
              "SETTLED"

          )

          .reduce(

            (acc, item) =>

              acc +
              item.doctorAmount,

            0
          );




      // =========================
      // RESPONSE
      // =========================

      res.status(200).json({

        success: true,

        summary: {

          totalEarning,

          pendingAmount,

          settledAmount,
        },

        count:
          appointments.length,

        data:
          appointments,
      });

    } catch (error) {

      console.log(
        "GET DOCTOR EARNINGS ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };


/* ==========================================
   💰 SETTLE PAYMENT FROM ADMIN
========================================== */

exports.receiveSettlement =
  async (req, res) => {

    try {

      const {

        adminCommission,

        doctorAmount,

      } = req.body;



      // ==========================================
      // FIND APPOINTMENT
      // ==========================================

      const appointment =
        await Appointment.findById(
          req.params.id
        );



      if (!appointment) {

        return res.status(404).json({

          success: false,

          message:
            "Appointment not found",
        });

      }



      // ==========================================
      // UPDATE
      // ==========================================

      appointment.adminCommission =
        adminCommission;

      appointment.doctorAmount =
        doctorAmount;

      appointment.settlementStatus =
        "SETTLED";



      await appointment.save();




      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(200).json({

        success: true,

        message:
          "Settlement received successfully",

        data:
          appointment,
      });

    } catch (error) {

      console.log(
        "RECEIVE SETTLEMENT ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,
      });

    }

  };

