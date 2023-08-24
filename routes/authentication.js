const { Router } = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { loginSchema, registerSchema } = require("../utils/validation");
const {
  getAccessToken,
  getRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} = require("../utils/jwt");

const router = Router();

router.post("/login", async (req, res, next) => {
  let validatedResult;
  try {
    validatedResult = await loginSchema.validate(req.body);
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
  const { email, password } = validatedResult;
  const invalidUserError = new Error("Incorrect email or password");
  invalidUserError.statusCode = 400;

  // Checking if user exists
  let userFromDb = await User.findOne({ email });
  if (!userFromDb) {
    return next(invalidUserError);
  }

  try {
    // Comparing if the passwords match or not.
    const isPasswordCorrect = bcrypt.compareSync(password, userFromDb.password);
    if (!isPasswordCorrect) {
      throw invalidUserError;
    }

    // Converting to Object and removing the password field
    userFromDb = userFromDb._doc;
    delete userFromDb.password;

    // Generating auth tokens
    const accessToken = getAccessToken(userFromDb);
    const refreshToken = getRefreshToken(userFromDb);

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 5400000,
        path: "/",
      })
      .send({ ...userFromDb, accessToken });
  } catch (error) {
    return next(error);
  }
});

router.post("/register", async (req, res, next) => {
  // Request body validation
  let validatedResult;
  try {
    validatedResult = await registerSchema.validate(req.body);
  } catch (error) {
    error.statusCode = 400;
    return next(error);
  }
  const { fullName, email, password } = validatedResult;

  // Checking if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 403;
    return next(error);
  }

  try {
    let newUser = new User({
      fullName,
      email,
      password: bcrypt.hashSync(password, bcrypt.genSaltSync()),
    });
    await newUser.save();

    // Converting to Object and removing the password field
    newUser = newUser._doc;
    delete newUser.password;

    // Generating auth tokens
    const accessToken = getAccessToken(newUser);
    const refreshToken = getRefreshToken(newUser);

    res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 5400000,
        path: "/",
      })
      .send({ ...newUser, accessToken });
  } catch (error) {
    return next(error);
  }
});

router.get("/logout", (req, res) => {
  res.cookie("refreshToken", "").send();
});

router.get("/refresh", async (req, res, next) => {
  let refreshToken = req.cookies?.refreshToken;

  // Checking if refresh token exists or not in cookie
  if (!refreshToken) {
    const error = new Error("Unable to verify missing refresh token");
    error.statusCode = 400;
    return next(error);
  }

  try {
    const { _id } = verifyRefreshToken(refreshToken);
    let user = await User.findById(_id);
    user = user._doc;
    delete user.password;
    const accessToken = getAccessToken(user);
    res.send({ ...user, accessToken });
  } catch (err) {
    if (["TokenExpiredError", "JsonWebTokenError"].includes(err.name)) {
      const error = new Error("Invalid refresh token");
      error.statusCode = 403;
      next(error);
    } else {
      next(err);
    }
  }
});

module.exports = router;
