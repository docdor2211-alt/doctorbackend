const mongoose = require("mongoose");

/* =========================
   💊 PRESCRIBED MEDICINE SCHEMA
========================= */
const prescribedMedicineSchema = new mongoose.Schema({
  // Pharmacy product reference (optional)
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicineItem",
    required: false,
  },

  // Medicine Name
  medicineName: {
    type: String,
    default: "",
  },

  // Dosage e.g., "1 Tablet", "500mg", "10ml"
  dosage: {
    type: String,
    default: "",
  },

  // Specific time slots: Morning, Noon, Evening, Night, Alternate Day
  timeSlots: {
    morning: {
      type: Boolean,
      default: false,
    },
    noon: {
      type: Boolean,
      default: false,
    },
    evening: {
      type: Boolean,
      default: false,
    },
    night: {
      type: Boolean,
      default: false,
    },
    alternateDay: {
      type: Boolean,
      default: false,
    },
  },

  // Array format of slots for convenient reading e.g. ["Morning", "Night"]
  slots: [
    {
      type: String,
    },
  ],

  // Specific application instructions: After Meal, Before Meal, Local Apply
  instruction: {
    type: String,
    enum: ["After Meal", "Before Meal", "Local Apply", "With Meal", ""],
    default: "After Meal",
  },

  // Duration e.g. "5 Days", "2 Weeks"
  duration: {
    type: String,
    default: "",
  },

  // Frequency e.g. "1-0-1", "Twice a day"
  frequency: {
    type: String,
    default: "",
  },

  // Additional freeform instructions
  instructions: {
    type: String,
    default: "",
  },
});

/* =========================
   💉 CLINIC SERVICE / PROCEDURE SCHEMA
========================= */
const prescriptionServiceSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ClinicService",
    required: false,
  },
  serviceName: {
    type: String,
    required: true, // e.g. "Laser Hair Removal"
  },
  sessionNumber: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  discountType: {
    type: String,
    enum: ["fixed", "percentage"],
    default: "fixed",
  },
  netAmount: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: "",
  },
});

/* =========================
   🩺 DOCSIDE PRESCRIPTION SCHEMA
========================= */
const docsidePrescriptionSchema = new mongoose.Schema(
  {
    // ✅ APPOINTMENT ID
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },

    // ✅ DOCTOR ID
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // ✅ USER ID
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ VITAL SIGNS: Weight, Temperature, Pulse, Blood Pressure, and SpO2
    vitalSigns: {
      weight: {
        type: String,
        default: "",
      },
      temperature: {
        type: String,
        default: "",
      },
      pulse: {
        type: String,
        default: "",
      },
      bloodPressure: {
        type: String,
        default: "",
      },
      spO2: {
        type: String,
        default: "",
      },
    },

    // ✅ COMPLAINTS (Predefined or custom created on the fly)
    complaints: [
      {
        type: String,
      },
    ],

    // Legacy string format for backward compatibility
    chiefComplaints: {
      type: String,
      default: "",
    },

    // ✅ PATIENT HISTORY (Dedicated text field for medical, family, past history)
    patientHistory: {
      type: String,
      default: "",
    },

    // ✅ DIAGNOSIS (Dedicated text field)
    diagnosis: {
      type: String,
      default: "",
    },

    // Legacy provisionalDiagnosis field kept in sync
    provisionalDiagnosis: {
      type: String,
      default: "",
    },

    // ✅ EXAMINATION FINDINGS
    examinationFindings: {
      type: String,
      default: "",
    },

    // ✅ CLINICAL NOTES
    clinicalNotes: {
      type: String,
      default: "",
    },

    // ✅ PRESCRIBED MEDICINES
    medicines: [prescribedMedicineSchema],

    // ✅ BILLABLE CLINIC SERVICES & PROCEDURES
    services: [prescriptionServiceSchema],

    // ✅ DIETARY & LIFESTYLE ADVICE (items to eat, items to avoid, lifestyle advice)
    dietaryAdvice: {
      itemsToEat: [
        {
          type: String,
        },
      ],
      itemsToAvoid: [
        {
          type: String,
        },
      ],
      lifestyleAdvice: {
        type: String,
        default: "",
      },
      notes: {
        type: String,
        default: "",
      },
    },

    // Legacy string format for dietary advice
    dietaryInstructions: {
      type: String,
      default: "",
    },

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

module.exports = mongoose.model(
  "DocsidePrescription",
  docsidePrescriptionSchema
);