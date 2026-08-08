// models/receptionModel.js

const mongoose =
  require("mongoose");

const bcrypt =
  require("bcryptjs");



const receptionSchema =
  new mongoose.Schema(

    {

      // ======================================================
      // DOCTOR ID
      // ======================================================

      doctorId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Doctor",

        required: true,

      },



      // ======================================================
      // RECEPTION NAME
      // ======================================================

      fullname: {

        type: String,

        required: true,

        trim: true,

      },



      // ======================================================
      // EMAIL
      // ======================================================

      email: {

        type: String,

        required: true,

        unique: true,

        lowercase: true,

        trim: true,

      },



      // ======================================================
      // PHONE
      // ======================================================

      phone: {

        type: String,

        required: true,

        trim: true,

      },



      // ======================================================
      // PASSWORD
      // ======================================================

      password: {

        type: String,

        required: true,

        minlength: 6,

        select: false,

      },



      // ======================================================
      // ROLE
      // ======================================================

      role: {

        type: String,

        default: "reception",

      },



      // ======================================================
      // PROFILE IMAGE
      // ======================================================

      profileImage: {

        type: String,

        default: "",

      },



      // ======================================================
      // GENDER
      // ======================================================

      gender: {

        type: String,

        enum: [

          "male",

          "female",

          "other",

        ],

        default: "male",

      },



      // ======================================================
      // ADDRESS
      // ======================================================

      address: {

        type: String,

        default: "",

      },



      // ======================================================
      // EXPERIENCE
      // ======================================================

      experience: {

        type: String,

        default: "",

      },



      // ======================================================
      // ACTIVE
      // ======================================================

      isActive: {

        type: Boolean,

        default: true,

      },



      // ======================================================
      // BLOCKED
      // ======================================================

      isBlocked: {

        type: Boolean,

        default: false,

      },

    },

    {

      timestamps: true,

    }

  );



// ======================================================
// HASH PASSWORD
// ======================================================

receptionSchema.pre(

  "save",

  async function (
    next
  ) {

    if (
      !this.isModified(
        "password"
      )
    ) {

      return next();

    }



    this.password =
      await bcrypt.hash(

        this.password,

        10

      );



    next();

  }

);



// ======================================================
// MATCH PASSWORD
// ======================================================

receptionSchema.methods.matchPassword =
  async function (
    enteredPassword
  ) {

    return await bcrypt.compare(

      enteredPassword,

      this.password

    );

  };



module.exports =
  mongoose.model(

    "Reception",

    receptionSchema

  );