const { Router } = require("express");
const multer = require("multer");
const multerS3 = require("multer-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");
const { S3Client } = require("@aws-sdk/client-s3");

require("dotenv").config();

const router = Router();
const s3Client = new S3Client({
  credentials: fromEnv(),
});
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

router.post("/upload", upload.single("file"), (req, res) => {
  res.status(201).send("File Uploaded ");
});

module.exports = router;
