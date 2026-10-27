const mongoose = require("mongoose");

const templateMedicineSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MedicineItem",
    required: false,
  },
  medicineName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    default: "",
  },
  timeSlots: {
    morning: { type: Boolean, default: false },
    noon: { type: Boolean, default: false },
    evening: { type: Boolean, default: false },
    night: { type: Boolean, default: false },
    alternateDay: { type: Boolean, default: false },
  },
  slots: [
    {
      type: String,
    },
  ],
  instruction: {
    type: String,
    enum: ["After Meal", "Before Meal", "Local Apply", "With Meal", ""],
    default: "After Meal",
  },
  instructions: {
    type: String,
    default: "",
  },
  duration: {
    type: String,
    default: "",
  },
  frequency: {
    type: String,
    default: "",
  },
});

const templateServiceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  sessionNumber: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
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
});

const illnessTemplateSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null, // null for predefined system templates
    },
    templateName: {
      type: String,
      required: true,
      trim: true,
    },
    complaints: [
      {
        type: String,
      },
    ],
    diagnosis: {
      type: String,
      default: "",
    },
    patientHistory: {
      type: String,
      default: "",
    },
    examinationFindings: {
      type: String,
      default: "",
    },
    clinicalNotes: {
      type: String,
      default: "",
    },
    medicines: [templateMedicineSchema],
    services: [templateServiceSchema],
    labInvestigations: [
      {
        type: String,
      },
    ],
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

illnessTemplateSchema.index({ templateName: 1, doctorId: 1 }, { unique: true });

module.exports = mongoose.model("IllnessTemplate", illnessTemplateSchema);
