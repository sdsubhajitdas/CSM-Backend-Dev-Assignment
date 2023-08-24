const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middlewares/error");
const authenticationRouter = require("./routes/authentication");
const fileRouter = require("./routes/file");
const { checkAuthentication } = require("./middlewares/authentication");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const router = express.Router();

// Prefixing all the backend routes with /api
app.use("/api", router);

router.use("/authentication", authenticationRouter);

// Protected routes
router.use(checkAuthentication);

router.use("/file", fileRouter);

// Error handling middleware
router.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URL)
  .then((_) => {
    app.listen(process.env.PORT, () => {
      console.log(
        `DB connected and server running on port ${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("DB connection failed: " + error.message);
  });
