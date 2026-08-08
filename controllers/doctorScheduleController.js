// controllers/doctorScheduleController.js

const DoctorSchedule =
  require(
    "../models/doctorScheduleModel"
  );



/* =========================
   ✅ CREATE SCHEDULE
========================= */

exports.createSchedule =
  async (req, res) => {

    try {

      const {
        date,
        slots,
      } = req.body;



      // ✅ VALIDATION
      if (
        !date ||
        !slots ||
        !Array.isArray(slots)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Date and slots are required",

        });

      }



      // ✅ CHECK EXISTING
      const existing =
        await DoctorSchedule.findOne({

          doctorId:
            req.doctor._id,

          date,

        });

      if (existing) {

        return res.status(400).json({

          success: false,

          message:
            "Schedule already exists for this date",

        });

      }



      // ✅ CREATE SCHEDULE
      const schedule =
        await DoctorSchedule.create({

          doctorId:
            req.doctor._id,

          date,

          slots,

        });



      res.status(201).json({

        success: true,

        message:
          "Schedule created successfully",

        data:
          schedule,

      });

    } catch (error) {

      console.log(
        "CREATE SCHEDULE ERROR =>",
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
   ✅ GET MY SCHEDULES
========================= */

exports.getMySchedules =
  async (req, res) => {

    try {

      const schedules =
        await DoctorSchedule.find({

          doctorId:
            req.doctor._id,

        })

          .sort({
            date: 1,
          });



      res.status(200).json({

        success: true,

        count:
          schedules.length,

        data:
          schedules,

      });

    } catch (error) {

      console.log(
        "GET SCHEDULES ERROR =>",
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
   ✅ GET SINGLE SCHEDULE
========================= */

exports.getSingleSchedule =
  async (req, res) => {

    try {

      const schedule =
        await DoctorSchedule.findById(
          req.params.id
        );

      if (!schedule) {

        return res.status(404).json({

          success: false,

          message:
            "Schedule not found",

        });

      }



      // ✅ OWNER CHECK
      if (
        schedule.doctorId.toString() !==
        req.doctor._id.toString()
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }



      res.status(200).json({

        success: true,

        data:
          schedule,

      });

    } catch (error) {

      console.log(
        "GET SINGLE SCHEDULE ERROR =>",
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
   ✅ UPDATE SCHEDULE
========================= */

exports.updateSchedule =
  async (req, res) => {

    try {

      const schedule =
        await DoctorSchedule.findById(
          req.params.id
        );

      if (!schedule) {

        return res.status(404).json({

          success: false,

          message:
            "Schedule not found",

        });

      }



      // ✅ OWNER CHECK
      if (
        schedule.doctorId.toString() !==
        req.doctor._id.toString()
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }



      // ✅ UPDATE
      schedule.date =
        req.body.date ||
        schedule.date;

      schedule.slots =
        req.body.slots ||
        schedule.slots;



      await schedule.save();



      res.status(200).json({

        success: true,

        message:
          "Schedule updated successfully",

        data:
          schedule,

      });

    } catch (error) {

      console.log(
        "UPDATE SCHEDULE ERROR =>",
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
   ✅ DELETE SCHEDULE
========================= */

exports.deleteSchedule =
  async (req, res) => {

    try {

      const schedule =
        await DoctorSchedule.findById(
          req.params.id
        );

      if (!schedule) {

        return res.status(404).json({

          success: false,

          message:
            "Schedule not found",

        });

      }



      // ✅ OWNER CHECK
      if (
        schedule.doctorId.toString() !==
        req.doctor._id.toString()
      ) {

        return res.status(403).json({

          success: false,

          message:
            "Not authorized",

        });

      }



      await schedule.deleteOne();



      res.status(200).json({

        success: true,

        message:
          "Schedule deleted successfully",

      });

    } catch (error) {

      console.log(
        "DELETE SCHEDULE ERROR =>",
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
   ✅ GET AVAILABLE SLOTS
========================= */

exports.getDoctorAvailableSlots =
  async (req, res) => {

    try {

      const {
        doctorId
      } = req.params;

      const {
        date
      } = req.query;



      // ✅ CHECK SCHEDULE
      const schedule =
        await DoctorSchedule.findOne({

          doctorId,
          date,

        });

      if (!schedule) {

        return res.status(404).json({

          success: false,

          message:
            "No schedule found",

        });

      }



      // ✅ FILTER FREE SLOTS
      const availableSlots =
        schedule.slots.filter(

          (slot) =>

            slot.isBooked === false &&

            slot.type !== "break"

        );



      res.status(200).json({

        success: true,

        count:
          availableSlots.length,

        data:
          availableSlots,

      });

    } catch (error) {

      console.log(
        "AVAILABLE SLOT ERROR =>",
        error
      );

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };