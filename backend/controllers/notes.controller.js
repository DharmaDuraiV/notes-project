const Note = require("../models/notesModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Create Note
exports.createNotes = catchAsync(async (req, res, next) => {
  // console.log(req.user._id);

  const { title, description, price, discount } = req.body;

  const newNote = await Note.create({
    title,
    description,
    price,
    discount,
    user_id:req.user._id
  });

  res.status(201).json({
    status: "success",
    data: newNote,
  });
});

// Get All Notes
exports.getNotes = catchAsync(async (req, res, next) => {
  const notes = await Note.find().populate("user_id");

  res.status(200).json({
    status: "success",
    results: notes.length,
    data: notes,
  });
});

// Get Single Note
exports.getSingleNote = catchAsync(async (req, res, next) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return next(new AppError(404, "Note not found."));
  }

  res.status(200).json({
    status: "success",
    data: note,
  });
});

// Update Note
exports.updateNote = catchAsync(async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!note) {
    return next(new AppError(404, "Note not found."));
  }

  // const note = await Note.findById(req.params.id);

  // if (!note) {
  //   return next(new AppError(404, "Note not found."));
  // }

  // note.title = req.body.title ? req.body.title : note.title;
  // note.description = req.body.description
  //   ? req.body.description
  //   : note.description;

  // note.price = req.body.price ? req.body.price : note.price;
  // note.discount = req.body.discount ? req.body.discount : note.discount;

  // await note.save({ returnDocument: "after" });
  res.status(200).json({
    status: "success",
    data: note,
  });
});

// Delete Note
exports.deleteNote = catchAsync(async (req, res, next) => {
  const deletedNote = await Note.findByIdAndDelete(req.params.id);

  if (!deletedNote) {
    return next(new AppError(404, "Note not found."));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
