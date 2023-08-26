const express = require("express");
const mongoose = require("mongoose");
const fileRouter = require("./routes/file");
const cookieParser = require("cookie-parser");
const imageRouter = require("./routes/image");
const paymentRouter = require("./routes/payment");
const { errorHandler } = require("./middlewares/error");
const authenticationRouter = require("./routes/authentication");
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
router.use("/image", imageRouter);
router.use("/payment", paymentRouter);

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
