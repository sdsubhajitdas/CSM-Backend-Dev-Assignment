const multer = require("multer");
const { Router } = require("express");
const multerS3 = require("multer-s3");
const { User } = require("../models/User");
const { Image } = require("../models/Image");
const { S3Client } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");

require("dotenv").config();

const router = Router();
const s3Client = new S3Client({
  credentials: fromEnv(),
});
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
      cb(null, `${req.uploadFolder}/${Date.now()}-${file.originalname}`);
    },
  }),
});

function applyUploadConstraintsToFreeTier(req, res, next) {
  if (req.user.subscription.tier === "PRO") return next();

  let timeDifference = Math.ceil(
    (Date.now() - new Date(req.user.lastUploadTimestamp).getTime()) / 1000
  );
  if (timeDifference >= 3600) return next();

  res.status(400).send({
    message: `Free tier users can only upload one image an hour. You can again upload in ${Math.ceil(
      60 - timeDifference / 60
    )} minutes`,
  });
}

function applyUploadConstraintsToProTier(req, res, next) {
  if (req.user.subscription.tier === "PRO") return next();
  res.status(403).send({
    message: "Multiple file uploads only authorized for Pro tier subscription",
  });
}

function uploadFolderPreprocessor(req, res, next) {
  req.uploadFolder = `${req.user.email}-${req.user._id}`;
  next();
}

router.post(
  "/upload",
  applyUploadConstraintsToFreeTier,
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
      await User.findByIdAndUpdate(req.user._id, {
        lastUploadTimestamp: image.createTimestamp,
      });

      res.status(201).send(image);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/uploads",
  applyUploadConstraintsToProTier,
  uploadFolderPreprocessor,
  upload.array("file"),
  async (req, res, next) => {
    try {
      let images = req.files.map((file) => ({
        fileName: file.originalname,
        url: file.location,
        userId: req.user._id,
        path: file.key,
        uploadMetadata: file,
      }));

      images = await Image.insertMany(images);
      await User.findByIdAndUpdate(req.user._id, {
        lastUploadTimestamp: Date.now() * 1000,
      });

      res.status(201).send(images);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
