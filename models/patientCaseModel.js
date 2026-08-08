
const mongoose =
  require("mongoose");



/* =====================================================
   ✅ PATIENT CASE SCHEMA
===================================================== */

const patientCaseSchema =
  new mongoose.Schema(

    {

      // =================================================
      // USER
      // =================================================

      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },



      // =================================================
      // CURRENT APPOINTMENT
      // =================================================

      currentAppointmentId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Appointment",

        required: true,
      },



      // =================================================
      // CURRENT PRESCRIPTION
      // =================================================

      currentPrescriptionId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "DocsidePrescription",

        default: null,
      },



      // =================================================
      // ALL APPOINTMENTS
      // =================================================

      appointmentHistory: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Appointment",
        },
      ],



      // =================================================
      // ALL PRESCRIPTIONS
      // =================================================

      prescriptionHistory: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "DocsidePrescription",
        },
      ],



      // =================================================
      // SUMMARY
      // =================================================

      totalAppointments: {

        type: Number,

        default: 0,
      },

      totalPrescriptions: {

        type: Number,

        default: 0,
      },

      completedAppointments: {

        type: Number,

        default: 0,
      },

      pendingAppointments: {

        type: Number,

        default: 0,
      },

      cancelledAppointments: {

        type: Number,

        default: 0,
      },

      paidAppointments: {

        type: Number,

        default: 0,
      },



      // =================================================
      // LAST VISIT
      // =================================================

      lastVisitedDoctor: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Doctor",

        default: null,
      },



      lastVisitDate: {

        type: Date,

        default: null,
      },



      // =================================================
      // STATUS
      // =================================================

      isActive: {

        type: Boolean,

        default: true,
      },

    },

    {

      timestamps: true,
    }

  );



/* =====================================================
   ✅ EXPORT
===================================================== */

module.exports =
  mongoose.model(

    "PatientCase",

    patientCaseSchema

  );
