const { Router } = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");
const { S3Client } = require("@aws-sdk/client-s3");
const { Image } = require("../models/Image");

require("dotenv").config();

const router = Router();
const s3Client = new S3Client({
  credentials: fromEnv(),
});
const uploadFolderPreprocessor = (req, res, next) => {
  req.uploadFolder = `${req.user.email}-${req.user._id}`;
  next();
};
const upload = multer({
  fileFilter: function (req, file, callback) {
    const type = file.mimetype.split("/")[0];
    callback(
      type === "image" ? null : new Error("Only images formats allowed"),
      type === "image"
    );
  },
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, `${req.uploadFolder}/${file.originalname}-${Date.now()}`);
    },
  }),
});

router.post(
  "/upload",
  uploadFolderPreprocessor,
  upload.single("file"),
  async (req, res, next) => {
    try {
      const image = new Image({
        fileName: req.file.originalname,
        url: req.file.location,
        userId: req.user._id,
        path: req.file.key,
        uploadMetadata: req.file,
      });
      await image.save();
      res.status(201).send(image);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
