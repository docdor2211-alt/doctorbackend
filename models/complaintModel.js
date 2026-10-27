const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null, // null for system predefined complaints
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: "General",
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

// Compound index to avoid duplicate complaint names for the same doctor or global
complaintSchema.index({ name: 1, doctorId: 1 }, { unique: true });

module.exports = mongoose.model("Complaint", complaintSchema);
