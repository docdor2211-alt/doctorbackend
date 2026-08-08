const mongoose = require("mongoose");

const appointmentSchema =
  new mongoose.Schema(
    {
      userId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      doctorId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
      },

      patientName: String,

      age: Number,

      gender: String,

      reason: String,

      token: Number,

      date: {
        type: String,
        required: true,
      },

      time: {
        type: String,
        required: true,
      },

      type: {
        type: String,
        enum: [
          "online",
          "in-person",
        ],
        required: true,
      },

      latitude: Number,

      longitude: Number,

      bloodPressure: {
        type: String,
        default: "",
      },

      weight: {
        type: String,
        default: "",
      },

      temperature: {
        type: String,
        default: "",
      },

      status: {
        type: String,
        enum: [
          "approved",
          "completed",
          "cancelled",
        ],
        default: "approved",
      },

// ✅ PAYMENT
paymentMethod: {

  type: String,

  default: "ONLINE",
},

paymentStatus: {

  type: String,

  enum: [
    "PENDING",
    "PAID",
    "FAILED",
  ],

  default: "PENDING",
},

settlementStatus: {

  type: String,

  enum: [
    "PENDING",
    "SETTLED",
  ],

  default: "PENDING",
},

appointmentFees: {

  type: Number,

  default: 0,
},

adminCommission: {

  type: Number,

  default: 0,
},

doctorAmount: {

  type: Number,

  default: 0,
},

paidAt: {

  type: Date,
},


    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Appointment",
    appointmentSchema
  );