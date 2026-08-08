
const mongoose =
  require("mongoose");
  const prescribedMedicineSchema =
  new mongoose.Schema({

    // ✅ PHARMACY PRODUCT ID
 productId: {

  type:
    mongoose.Schema.Types.ObjectId,

  ref: "MedicineItem",

  required: true,

},

    // ✅ DOSAGE
    dosage: {

      type: String,

      default: "",

    },

    // ✅ FREQUENCY
    frequency: {

      type: String,

      default: "",

    },

    // ✅ DURATION
    duration: {

      type: String,

      default: "",

    },

    // ✅ INSTRUCTIONS
    instructions: {

      type: String,

      default: "",

    },

  });



/* =========================
   🩺 PRESCRIPTION SCHEMA
========================= */

const docsidePrescriptionSchema =
  new mongoose.Schema({

    // ✅ APPOINTMENT ID
    appointmentId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Appointment",

      required: true,

    },



    // ✅ DOCTOR ID
    doctorId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Doctor",

      required: true,

    },



    // ✅ USER ID
    userId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    // ✅ CHIEF COMPLAINTS
    chiefComplaints: {

      type: String,

      default: "",

    },



    // ✅ EXAMINATION FINDINGS
    examinationFindings: {

      type: String,

      default: "",

    },



    // ✅ PROVISIONAL DIAGNOSIS
    provisionalDiagnosis: {

      type: String,

      default: "",

    },



    // ✅ CLINICAL NOTES
    clinicalNotes: {

      type: String,

      default: "",

    },



    // ✅ PRESCRIBED MEDICINES
  medicines: [
  prescribedMedicineSchema
],

// ✅ SYMPTOMS
symptoms: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "OnlineSymptom",
  },
],

    // ✅ LAB INVESTIGATIONS
    labInvestigations: [

      {
        type: String,
      },

    ],



    // ✅ DIETARY INSTRUCTIONS
    dietaryInstructions: {

      type: String,

      default: "",

    },



    // ✅ DOCTOR ADVICE
    doctorsAdvice: {

      type: String,

      default: "",

    },



    // ✅ PDF URL
    pdfUrl: {

      type: String,

      default: "",

    },

  },

  {
    timestamps: true,
  }
);



module.exports =
  mongoose.model(
    "DocsidePrescription",
    docsidePrescriptionSchema
  );