const mongoose =
  require("mongoose");



const slotSchema =
  new mongoose.Schema({

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    type: {
      type: String,

      enum: [
        "consultation",
        "checkup",
        "break",
      ],

      default:
        "consultation",
    },

    isBooked: {
      type: Boolean,
      default: false,
    },

  });



const doctorScheduleSchema =
  new mongoose.Schema({

    doctorId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Doctor",

      required: true,

    },



    date: {

      type: String,

      required: true,

    },



    slots: [
      slotSchema
    ],

  },

  {
    timestamps: true,
  }
);



module.exports =
  mongoose.model(
    "DoctorSchedule",
    doctorScheduleSchema
  );