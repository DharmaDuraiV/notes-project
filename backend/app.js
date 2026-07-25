const express = require("express");
const path = require("node:path");
const morgan = require("morgan");

const globalError = require("./middleware/globalError");
const notesRoute = require("./routes/notes.route");
const authRoute = require("./routes/auth.route");
const AppError = require("./utils/appError");

const app = express();

// app.use((req, res, next) => {
//   console.log("i am a middleware");
//   console.log(req.headers);
//   next();
// });

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http://localhost:8000/api/v1/notes
app.use("/api/v1/notes", notesRoute);
app.use("/api/v1/auth", authRoute);

app.all("/*any", (req, res, next) => {
  next(
    new AppError(404, `route is not found with this path ${req.originalUrl}`),
  );
});

app.use(globalError);

module.exports = app;
