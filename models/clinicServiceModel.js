const mongoose = require("mongoose");

const clinicServiceSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      default: null, // null for system predefined clinic services
    },
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "General Procedure",
    },
    defaultPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      default: "",
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

clinicServiceSchema.index({ serviceName: 1, doctorId: 1 }, { unique: true });

module.exports = mongoose.model("ClinicService", clinicServiceSchema);
