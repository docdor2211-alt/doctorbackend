const mongoose =
  require("mongoose");

const pharmacyProductSchema =
  new mongoose.Schema(

    {

      pharmacy: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "PharmacyUser",

      },

      productTitle: {

        type: String,

      },

      brand: {

        type: String,

      },

      category: {

        type: String,

      },

      description: {

        type: String,

      },

      mrp: {

        type: Number,

      },

      discount: {

        type: Number,

      },

      stock: {

        type: Number,

      },

      gst: {

        type: String,

      },

      expiryDate: {

        type: String,

      },

      prescriptionRequired: {

        type: Boolean,

      },

      image: {

        type: String,

      },

    },

    {
      timestamps: true,
    }

  );

module.exports =
  mongoose.model(
    "MedicineItem",
    pharmacyProductSchema
  );