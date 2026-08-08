const express =
  require("express");

const router =
  express.Router();

const storyController =
  require(
    "../controllers/storyController"
  );

const {

  protect,

} = require(
  "../middleware/authMiddleware"
);

const upload =
  require(
    "../middleware/upload"
  );



// ======================================================
// CREATE STORY
// ======================================================

router.post(

  "/create",

  protect,

  upload.fields([

    {

      name: "image",

      maxCount: 1,

    },

    {

      name: "thumbnail",

      maxCount: 1,

    },

  ]),

  storyController.createStory

);
// ======================================================
// DELETE STORY
// ======================================================

router.delete(

  "/delete/:id",

  protect,

  storyController.deleteStory

);


// ======================================================
// EXPORT
// ======================================================

module.exports =
  router;