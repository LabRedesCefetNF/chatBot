const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", UserSchema);
