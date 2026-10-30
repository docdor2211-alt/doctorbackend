const mongoose = require("mongoose");

const patientContactSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    // Server userId when available, otherwise "name:<lowercased name>".
    key: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      default: "",
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
    },

    address: {
      type: String,
      default: "",
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

patientContactSchema.index({ doctorId: 1, key: 1 }, { unique: true });

module.exports = mongoose.model("PatientContact", patientContactSchema);
