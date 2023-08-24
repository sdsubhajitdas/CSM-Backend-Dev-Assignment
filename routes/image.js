const { Router } = require("express");
const { Image } = require("../models/Image");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const images = await Image.find({ userId: req.user._id }).sort({
      createTimestamp: "desc",
    });
    res.send(images);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
