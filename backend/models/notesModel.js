const { Schema, model, Query } = require("mongoose");
const mongoose = require("mongoose");
const noteSchema = new Schema({
  title: {
    type: String,
    required: [true, "please enter the title"],
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "please enter the description "],
    trim: true,
    minLength: [10, "description min it should contain 10 charaters"],
  },
  price: {
    type: Number,
    required: [true, "please enter the price"],
    min: [0, "price must be grater than or equls to 0"],
  },
  discount: {
    type: Number,
    default: 0, // create , .save()
    validate: {
      validator: function (val) {
        // updateOne() , updateMany(), findByIdAndUpdate()
        if (this instanceof Query) {
          const update = this.getUpdate();

          const price = update.$set?.price;
          return val <= price;
        }
        return val <= this.price;
      },

      message: "discount can not more than price",
    },
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

const Note = model("notes", noteSchema);
module.exports = Note;
