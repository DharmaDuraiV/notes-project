const mongoose = require("mongoose");

const mongodbUrl = "mongodb://localhost:27017/blinkIT";

const connectDB = async () => {
  try {
    await mongoose.connect(mongodbUrl);
    console.log("connected to mongodb server");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
