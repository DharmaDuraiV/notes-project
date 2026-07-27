const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");

const { promisify } = require("node:util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSignToken = (statusCode, user, res) => {
  const token = signToken(user._id);

  user.password = undefined;
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + Number(process.env.JWT_COOKIE_EXPIRE_TIME) * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("JWT", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
  });
};
exports.register = catchAsync(async (req, res, next) => {
  const { username, email, password, confirmPassword, role } = req.body;

  const user = await User.findOne({ email });

  const newuser = await User.create({
    username,
    email,
    password,
    confirmPassword,
    role,
  });

  createSignToken(201, newuser, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError(400, "email and password is mandatory"));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password))) {
    return next(new AppError(401, "email or password is worng"));
  }

  createSignToken(200, user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // check the headers
  let token = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // check the token is avaliable or not
  if (!token) {
    return next(
      new AppError(
        401,
        "you dont have access for the route .please login again...",
      ),
    );
  }
  // check the token is valid or not

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check the user is exists or not
  const currentUser = await User.findById(decode.id);
  // console.log(currentUser);
  if (!currentUser) {
    return next(
      new AppError(401, "The user belonging to this token no longer exists."),
    );
  }
  // store the user data in req object
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "You do not have permission to perform this action."),
      );
    }

    next();
  };
};
