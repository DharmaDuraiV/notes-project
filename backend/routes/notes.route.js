const express = require("express");

const notesController = require("../controllers/notes.controller");
const authController = require("../controllers/auth.controller");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin", "author"),
    notesController.createNotes,
  )
  .get(notesController.getNotes);

router
  .route("/:id")
  .get(notesController.getSingleNote)
  .patch(
    authController.restrictTo("admin", "author"),
    authController.protect,
    notesController.updateNote,
  )
  .delete(
    authController.restrictTo("admin"),
    authController.protect,
    notesController.deleteNote,
  );

module.exports = router;
