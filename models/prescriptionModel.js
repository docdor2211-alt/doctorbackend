const mongoose = require("mongoose");

const medicineSchema =
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },

    dosage: {
      type: String,
      required: true,
    },

    duration: {
      type: String,
      required: true,
    },
  });

const prescriptionSchema =
  new mongoose.Schema(
    {
      // ================= PRESCRIPTION ID =================

      prescriptionId: {
        type: String,
        default: () =>
          "RX" +
          Math.floor(
            1000 +
              Math.random() * 9000
          ),
      },



      // ================= PATIENT =================

      patient: {
        type: String,
        required: true,
      },

      patientId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },



      // ================= DOCTOR =================

      doctorId: {
        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Doctor",

        required: true,
      },

      doctorName: {
        type: String,
        required: true,
      },

      reg_no: {
        type: String,
        default: "12345-A",
      },



      // ================= PRESCRIPTION =================

      diagnosis: {
        type: String,
        required: true,
      },

      medicines: [medicineSchema],

      type: {
        type: String,
        default: "Follow-up",
      },

      instructions: [
        {
          type: String,
        },
      ],

      date: {
        type: String,

        default: () =>
          new Date().toDateString(),
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "Prescription",
  prescriptionSchema
);