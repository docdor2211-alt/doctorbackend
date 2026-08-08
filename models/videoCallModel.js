const mongoose =
  require("mongoose");



const videoCallSchema =
  new mongoose.Schema({

    appointmentId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Appointment",

      required: true,

    },



    doctorId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Doctor",

      required: true,

    },



    userId: {

      type:
        mongoose.Schema.Types.ObjectId,

      ref: "User",

      required: true,

    },



    roomId: {

      type: String,

      required: true,

    },



    callStatus: {

      type: String,

      enum: [

        "waiting",

        "ongoing",

        "completed",

        "missed",

        "cancelled",

      ],

      default: "waiting",

    },



    startedAt: Date,

    endedAt: Date,



    duration: {

      type: Number,

      default: 0,

    },
    // ================= SCHEDULE =================

appointmentDate: {

  type: String,

  default: "",

},

appointmentTime: {

  type: String,

  default: "",

},

patientName: {

  type: String,

  default: "",

},

issue: {

  type: String,

  default: "",

},

age: {

  type: Number,

  default: 0,

},

gender: {

  type: String,

  default: "",

},

weight: {

  type: String,

  default: "",

},

prescription: {

  type: String,

  default: "",

},

isCompleted: {

  type: Boolean,

  default: false,

},

  },

  {
    timestamps: true,
  }
);



module.exports =
  mongoose.model(
    "VideoCall",
    videoCallSchema
  );