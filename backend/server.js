const dotenv = require("dotenv");

dotenv.config({ path: `./env/${process.env.NODE_ENV}.env`, quiet: true });

const app = require("./app");

const connectDB = require("./config/db");

const port = process.env.PORT || 5000;
// console.log(process.env.NODE_ENV);

connectDB();
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`server is running http://localhost:${port}`);
});

// const crypto = require("node:crypto");

// const hash = crypto.pbkdf2Sync(
//   "note-backend-project",
//   "helloworld",
//   100000,
//   15,
//   "sha512",
// );

// console.log(hash.toString("hex"));

