const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    minLength: [5, "username must be 5 character"],
    maxLength: [30, "username can have upto 30 character"],
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [8, "password min it should 8 character"],
    trim: true,
    select: false,
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (cpassword) {
        return cpassword === this.password;
      },
      message: "password and confirmpassword both are not same",
    },
  },
  role: {
    type: String,
    enum: ["user", "author", "admin"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});

userSchema.methods.checkPassword = async function (userPassword) {
  return await bcrypt.compare(userPassword, this.password);
};

const User = model("users", userSchema);

module.exports = User;
