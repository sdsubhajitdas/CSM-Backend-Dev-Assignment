const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createTimestamp: { type: Date, default: Date.now },
  subscription: {
    tier: { type: String, enum: ["FREE", "PAID"], default: "FREE" },
    lastRenewedTimestamp: { type: Date, default: null },
  },
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
