const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },

    invoiceNo: {
      type: String,
      required: true,
    },

    appointmentId: {
      type: String,
      default: "",
    },

    patientId: {
      type: String,
      default: "",
    },

    patientName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    items: [
      {
        name: { type: String, default: "" },
        quantity: { type: Number, default: 1 },
        price: { type: Number, default: 0 },
      },
    ],

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Card", "Insurance", "Other"],
      default: "Cash",
    },

    status: {
      type: String,
      enum: ["Paid", "Pending", "Cancelled"],
      default: "Pending",
    },

    notes: {
      type: String,
      default: "",
    },

    invoiceDate: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

invoiceSchema.index({ doctorId: 1, invoiceNo: 1 }, { unique: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
