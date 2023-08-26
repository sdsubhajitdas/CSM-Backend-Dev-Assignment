const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createTimestamp: { type: Date, default: Date.now },
  lastUploadTimestamp: { type: Date },
  subscription: {
    tier: { type: String, enum: ["FREE", "PRO"], default: "FREE" },
    createTimestamp: { type: Date, default: null },
    expiryTimestamp: { type: Date, default: null },
    stripeCustomerId: { type: String, default: null },
    stripeSubscriptionId: { type: String, default: null },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
