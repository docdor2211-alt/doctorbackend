const axios =
  require("axios");



// ======================================================
// UPLOAD TO BUNNY CDN
// ======================================================

const uploadToBunny =
  async (file) => {

    try {

      const fileName =
        `${Date.now()}-${file.originalname}`;

      const url =
        `https://storage.bunnycdn.com/${process.env.BUNNY_STORAGE_ZONE}/${fileName}`;



      // ==========================================
      // UPLOAD FILE
      // ==========================================

      await axios.put(

        url,

        file.buffer,

        {

          headers: {

            AccessKey:
              process.env.BUNNY_STORAGE_PASSWORD,

            "Content-Type":
              file.mimetype,

          },

        }

      );



      // ==========================================
      // PUBLIC URL
      // ==========================================

      const fileUrl =
        `https://${process.env.BUNNY_CDN_HOSTNAME}/${fileName}`;



      return {

        success: true,

        url:
          fileUrl,

        fileName,

      };

    } catch (error) {

      console.log(
        "BUNNY UPLOAD ERROR =>",
        error.response?.data ||
        error.message
      );

      return {

        success: false,

        message:
          error.message,

      };

    }

  };

module.exports =
  uploadToBunny;