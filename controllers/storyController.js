// ======================================================
// controllers/storyController.js
// ======================================================

const Story =
  require(
    "../models/storyModel"
  );

const uploadToBunny =
  require(
    "../utils/bunnyUpload"
  );



// ======================================================
// CREATE STORY
// ======================================================

exports.createStory =
  async (req, res) => {

    try {

      // ==========================================
      // GET TITLE
      // ==========================================

      const {
        title,
      } = req.body;



      // ==========================================
      // CHECK TITLE
      // ==========================================

      if (!title) {

        return res.status(400).json({

          success: false,

          message:
            "Title is required",

        });

      }



      // ==========================================
      // CHECK IMAGE
      // ==========================================

      if (

        !req.files ||

        !req.files.image ||

        !req.files.thumbnail

      ) {

        return res.status(400).json({

          success: false,

          message:
            "Image and thumbnail are required",

        });

      }



      // ==========================================
      // GET FILES
      // ==========================================

      const imageFile =
        req.files.image[0];

      const thumbFile =
        req.files.thumbnail[0];



      // ==========================================
      // UPLOAD IMAGE
      // ==========================================

      const imageUpload =
        await uploadToBunny(

          imageFile

        );



      if (!imageUpload.success) {

        return res.status(500).json({

          success: false,

          message:
            "Image upload failed",

        });

      }



      // ==========================================
      // UPLOAD THUMBNAIL
      // ==========================================

      const thumbUpload =
        await uploadToBunny(

          thumbFile

        );



      if (!thumbUpload.success) {

        return res.status(500).json({

          success: false,

          message:
            "Thumbnail upload failed",

        });

      }



      // ==========================================
      // CREATE STORY
      // ==========================================

      const story =
        await Story.create({

          doctorId:
            req.doctor._id,

          title,

          imageUrl:
            imageUpload.url,

          thumbUrl:
            thumbUpload.url,

          isActive:
            true,

        });



      // ==========================================
      // RESPONSE
      // ==========================================

      res.status(201).json({

        success: true,

        message:
          "Story created successfully",

        data:
          story,

      });

    } catch (error) {

      console.log(

        "CREATE STORY ERROR =>",

        error

      );



      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// GET MY STORIES
// ======================================================

exports.getDoctorStories =
  async (req, res) => {

    try {

      const stories =
        await Story.find({

          doctorId:
            req.doctor._id,

        })

          .sort({

            createdAt: -1,

          });



      res.status(200).json({

        success: true,

        count:
          stories.length,

        data:
          stories,

      });

    } catch (error) {

      console.log(

        "GET STORIES ERROR =>",

        error

      );



      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// GET SINGLE STORY
// ======================================================

exports.getSingleStory =
  async (req, res) => {

    try {

      const story =
        await Story.findOne({

          _id:
            req.params.id,

          doctorId:
            req.doctor._id,

        });



      if (!story) {

        return res.status(404).json({

          success: false,

          message:
            "Story not found",

        });

      }



      res.status(200).json({

        success: true,

        data:
          story,

      });

    } catch (error) {

      console.log(

        "GET SINGLE STORY ERROR =>",

        error

      );



      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };



// ======================================================
// DELETE STORY
// ======================================================

exports.deleteStory =
  async (req, res) => {

    try {

      const story =
        await Story.findOne({

          _id:
            req.params.id,

          doctorId:
            req.doctor._id,

        });



      if (!story) {

        return res.status(404).json({

          success: false,

          message:
            "Story not found",

        });

      }



      await story.deleteOne();



      res.status(200).json({

        success: true,

        message:
          "Story deleted successfully",

      });

    } catch (error) {

      console.log(

        "DELETE STORY ERROR =>",

        error

      );



      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };