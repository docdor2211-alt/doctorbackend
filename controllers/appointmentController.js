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
        pulse,
        spO2,
        spo2,
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
        bloodPressure !== undefined ? bloodPressure : appointment.bloodPressure;

      appointment.weight =
        weight !== undefined ? weight : appointment.weight;

      appointment.temperature =
        temperature !== undefined ? temperature : appointment.temperature;

      appointment.pulse =
        pulse !== undefined ? pulse : appointment.pulse;

      appointment.spO2 =
        (spO2 !== undefined ? spO2 : spo2) !== undefined
          ? (spO2 !== undefined ? spO2 : spo2)
          : appointment.spO2;


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



/* =========================
   🆕 CREATE APPOINTMENT (DOCTOR / CLINIC)
========================= */

const User = require("../models/userModel");
const PatientContact = require("../models/patientContactModel");

const normalizeDateValue = (value) => {
  if (!value) return "";
  const raw = String(value);
  if (raw.includes("T")) return raw.split("T")[0];
  return raw;
};

const findOrCreatePatient = async ({ patientName, mobile, email }) => {
  const cleanEmail = (email || "").toString().trim().toLowerCase();
  const cleanPhone = (mobile || "").toString().replace(/[^0-9]/g, "");

  const lookups = [];
  if (cleanEmail) lookups.push({ email: cleanEmail });
  if (cleanPhone) lookups.push({ phone: cleanPhone });

  let user = lookups.length ? await User.findOne({ $or: lookups }) : null;

  if (user) {
    let changed = false;
    if (cleanPhone && !user.phone) {
      user.phone = cleanPhone;
      changed = true;
    }
    if (cleanEmail && !user.email) {
      user.email = cleanEmail;
      changed = true;
    }
    if (changed) await user.save();
    return user;
  }

  const fallbackEmail = `patient.${Date.now()}.${Math.floor(
    Math.random() * 100000
  )}@docside.local`;

  user = await User.create({
    fullname: patientName,
    email: cleanEmail || fallbackEmail,
    phone: cleanPhone,
    provider: "local",
    role: "user",
  });

  return user;
};

exports.createAppointment = async (req, res) => {
  try {
    const {
      patientName,
      age,
      gender,
      reason,
      date,
      time,
      type,
      mobile,
      email,
      latitude,
      longitude,
      appointmentFees,
      fees,
      status,
    } = req.body;

    if (!patientName || !String(patientName).trim()) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required",
      });
    }

    const normalizedDate = normalizeDateValue(date);
    if (!normalizedDate || !time) {
      return res.status(400).json({
        success: false,
        message: "Date and time are required",
      });
    }

    const user = await findOrCreatePatient({
      patientName,
      mobile,
      email,
    });

    const sameDayCount = await Appointment.countDocuments({
      doctorId: req.doctor._id,
      date: normalizedDate,
    });

    const appointment = await Appointment.create({
      userId: user._id,
      doctorId: req.doctor._id,
      patientName: String(patientName).trim(),
      age: Number(age) || 0,
      gender: gender || "Not specified",
      reason: reason ? String(reason) : "General Consultation",
      token: sameDayCount + 1,
      date: normalizedDate,
      time: String(time),
      // Backwards compatibility: older clients send "offline".
      type: type === "online" ? "online" : "in-person",
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      status: status === "pending" ? "pending" : "approved",
      appointmentFees: Number(appointmentFees ?? fees) || 0,
      paymentStatus: "PENDING",
      settlementStatus: "PENDING",
    });

    // Save the contact card alongside the appointment when details are given.
    if ((mobile && String(mobile).trim()) || (email && String(email).trim())) {
      const key = `user:${user._id}`;
      const nameKey = `name:${String(patientName).trim().toLowerCase()}`;
      const payload = {
        doctorId: req.doctor._id,
        userId: String(user._id),
        patientName: String(patientName).trim(),
        mobile: mobile ? String(mobile).trim() : "",
        email: email ? String(email).trim().toLowerCase() : "",
      };

      await PatientContact.findOneAndUpdate(
        { doctorId: req.doctor._id, key },
        { ...payload, key },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      await PatientContact.findOneAndUpdate(
        { doctorId: req.doctor._id, key: nameKey },
        { ...payload, key: nameKey },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    console.log("CREATE APPOINTMENT ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* =========================
   🔄 UPDATE APPOINTMENT STATUS
========================= */

const ALLOWED_STATUSES = [
  "pending",
  "approved",
  "confirmed",
  "in-progress",
  "waiting",
  "completed",
  "cancelled",
];

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !ALLOWED_STATUSES.includes(String(status))) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.doctorId.toString() !== req.doctor._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    appointment.status = String(status);

    if (status === "completed" || status === "cancelled") {
      appointment.paymentStatus = appointment.paymentStatus || "PENDING";
    }

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.log("UPDATE APPOINTMENT STATUS ERROR =>", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
