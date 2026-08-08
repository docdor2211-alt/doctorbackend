

const mongoose =
  require("mongoose");



/* =========================
   WORK EXPERIENCE
========================= */

const workExperienceSchema =
  new mongoose.Schema({

    role: {
      type: String,
      default: "",
    },

    hospital: {
      type: String,
      default: "",
    },

    period: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    isCurrent: {
      type: Boolean,
      default: false,
    },

  });



/* =========================
   DOCTOR MODEL
========================= */

const doctorSchema =
  new mongoose.Schema({

    // ================= BASIC =================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    googleId:{
      type: String,
      deafult:"",
    },
    authProvider:{
      type: String,
      default: "email",
    },

    phoneNumber: {
      type: String,
      default: "",
    },



    // ================= PROFILE =================

    speciality: {
      type: String,
      default: "",
    },

    doctorImagePath: {
      type: String,
      default: "",
    },

    clinicImagePath: {
      type: String,
      default: "",
    },



    // ================= REGISTRATION =================

    registrationNumber: {
      type: String,
      default: "",
    },

    medicalCouncil: {
      type: String,
      default: "",
    },

    primaryDegree: {
      type: String,
      default: "",
    },

    postGraduate: {
      type: String,
      default: "",
    },

    licenseStatus: {
      type: String,
      default: "Pending",
    },

    idStatus: {
      type: String,
      default: "Pending",
    },

    isLicenseVerified: {
      type: Boolean,
      default: false,
    },

    isIdVerified: {
      type: Boolean,
      default: false,
    },

    // ================= DOCUMENTS =================

medicalLicenseCopy: {

  type: String,

  default: "",

},

idProof: {

  type: String,

  default: "",

},



    // ================= EXPERIENCE =================

    yearsExperience: {
      type: String,
      default: "",
    },

    surgeries: {
      type: String,
      default: "",
    },

    awards: {
      type: String,
      default: "",
    },

    summary: {
      type: String,
      default: "",
    },

    workList: [
      workExperienceSchema
    ],



    // ================= CLINIC =================

    clinicName: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    timing: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    specialties: [
      {
        type: String,
      },
    ],



    // ================= LOCATION =================

    location: {

      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },

    },



    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },



    // ================= FEES =================

    fees: {
      type: Number,
      default: 0,
    },



    // ================= STATUS =================

    isApproved: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

  },

  {
    timestamps: true,
  }
);



doctorSchema.index({
  location: "2dsphere",
});



module.exports =
  mongoose.model(
    "Doctor",
    doctorSchema
  );