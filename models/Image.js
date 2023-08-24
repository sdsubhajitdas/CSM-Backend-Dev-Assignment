const mongoose = require("mongoose");
const { Schema } = mongoose;

const imageSchema = Schema({
  fileName: { type: String, required: true },
  url: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  path: { type: String, required: true },
  createTimestamp: { type: Date, default: Date.now },
  uploadMetadata: { type: Object, default: new Object() },
});

const Image = mongoose.model("Image", imageSchema);

module.exports = {
  Image,
};
